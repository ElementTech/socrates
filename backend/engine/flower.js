// add this script in myWorker.js file
const { parentPort, workerData } = require('worker_threads');
const DockerInstance = require('../models/DockerInstance');
dbConfig = require('../database/db');
const engine = require('./docker');
const Instance = require('../models/Instance');
const Block = require('../models/Block');
const FlowInstance = require('../models/FlowInstance');
let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.db, {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500, 
  connectTimeoutMS: 20000,
  socketTimeoutMS: 45000,
}).then(
  () => {
    console.log('Database sucessfully connected');
    run_flow();
  },
  (error) => {
    console.log(`Database could not connected: ${error}`);
    process.exit(error);
  },
);

continue_tree = true;

Array.prototype.unique = function (first = true) {
  const a = this.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if ((a[i] != undefined) && (a[j] != undefined)) {
        if (a[i].key === a[j].key) a.splice((first ? j-- : i--), 1);
      }
    }
  }

  return a;
};

async function run_flow() {
  const run_ids = await Promise.resolve(asyncSearch(workerData.flow.steps, workerData.flow.steps.length));
  create_flow_instance_in_database({
    _id: workerData.flow_run_id, flow: workerData.flow._id, run: run_ids, on_error: workerData.flow.on_error, done: false, error: false, skipped: false,
    user: workerData.flow.user
  });
  const generalEnv = await Promise.resolve(calculate_general_envs(run_ids));
  const startTime = new Date();
  const refreshTime = setInterval(() => {
    set_flow_instance_in_database(
      workerData.flow_run_id,
      { runtime: engine.duration(startTime, Date.now()) },
    );
  }, 1000);
  // Calculate Env

  // Before
  console.log(workerData.flow.dynamic);
  let extraEnv = [].concat(
    workerData.flow.parameters,
    workerData.flow.shared,
    workerData.flow.booleans,
    workerData.flow.multis,
    workerData.flow.dynamic != undefined ? (workerData.flow.dynamic != 0 ? workerData.flow.dynamic.map((dynamo) => ({ key: dynamo.name, value: dynamo.output })) : []) : [],
  ).unique(true);
  for (const step of run_ids) // During
  {
    if (continue_tree) {
      const stepRunIds = [];
      // let extraEnv = await Promise.resolve(get_outputs_and_envs(stepRunIds));
      for (const run_object of step) {
        Instance.findById(run_object.id).populate({
          path: 'block',
          model: Block,
        }).exec((error, data) => {
          if (error) {
            console.log(error);
            return error;
          }
          stepRunIds.push(run_object.run_id);
          engine.run(data, run_object.run_id, generalEnv.concat(extraEnv).unique(false));
        });
      }
      extraEnv = await Promise.resolve(wait_for_equal(stepRunIds, workerData.flow_run_id));
    } else {
      set_flow_instance_in_database(
        workerData.flow_run_id,
        { skipped: true },
      );
      console.log('Skipping next steps');
    }
  }
  // After
  clearInterval(refreshTime);
  set_flow_instance_in_database(
    workerData.flow_run_id,
    { done: true },
  );
  parentPort.postMessage('Done');
}

function asyncSearch(steps, maxlength) {
  return new Promise((resolve, reject) => {
    const run_ids = [];
    for (let index = 0; index < steps.length; index++) {
      const element = steps[index];
      const step = [];
      for (let indexj = 0; indexj < element.length; indexj++) {
        const inst = element[indexj];
        step.push({ id: inst.id, run_id: new mongoose.Types.ObjectId().toHexString(), ui_id: index.toString() + indexj.toString() });
      }
      run_ids.push(step);
      if (run_ids.length == maxlength) {
        resolve(run_ids);
      }
    }
  });
}

async function calculate_general_envs(run_ids) {
  return new Promise((resolve) => {
    let generalEnvVars = [];
    for (const step of run_ids) // During
    {
      for (const run_object of step) {
        Instance.findById(run_object.id, (error, doc) => {
          if (error) {
            console.log(error);
          }
          generalEnvVars = generalEnvVars.concat(doc.parameters).concat(doc.shared).concat(doc.booleans).concat(doc.multis)
            .concat(
              doc.dynamic != undefined ? (doc.dynamic != 0 ? doc.dynamic.map((dynamo) => ({ key: dynamo.name, value: dynamo.output })) : []) : [],
            );
          console.log(generalEnvVars.length, run_ids.length);
          if ((generalEnvVars.length >= run_ids.length) || (generalEnvVars.length == 0)) {
            resolve(generalEnvVars);
          }
        });
      }
    }
  });
}

async function wait_for_equal(stepRunIds, flow_run_id) {
  return new Promise((resolve) => {
    let finished = 0;
    let collectedOutputs = [];
    DockerInstance.watch()
      .on('change', (data) => {
        if ('updateDescription' in data) {
          if ('updatedFields' in data.updateDescription) {
            if ('done' in data.updateDescription.updatedFields) {
              if ((stepRunIds.includes(data.documentKey._id.toString())) && (data.updateDescription.updatedFields.done == true)) {
                if (data.updateDescription.updatedFields.error) {
                  set_flow_instance_in_database(
                    flow_run_id,
                    { error: true },
                  );
                  if (workerData.flow.on_error == 'stop') {
                    continue_tree = false;
                  }
                }
                if ((finished + 1) == stepRunIds.length) {
                  resolve(collectedOutputs);
                } else {
                  DockerInstance.findById(data.documentKey._id.toString(), (error, dockerinst) => {
                    collectedOutputs = collectedOutputs.concat(dockerinst.parameters).concat(dockerinst.output);
                  });
                  finished++;
                }
              }
            }
          }
        }
      });
  });
}

function create_flow_instance_in_database(flow_instance_body) {
  FlowInstance.create(flow_instance_body, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      // docker.run_flow(data._id)
      console.log('Flow Instance Created');
    }
  });
}

function set_flow_instance_in_database(generated_id, flow_body) {
  FlowInstance.findByIdAndUpdate(generated_id, {
    $set: flow_body,
  }, (error, data) => {
    if (error) {
      console.log(error);
    } else {

    }
  });
}
