// add this script in myWorker.js file
const { parentPort, workerData } = require('worker_threads');
const DockerInstance = require('../models/DockerInstance');
dbConfig = require('../database/db');
const engine = require('./docker');
const Instance = require('../models/Instance');
const Block = require('../models/Block');
const Docker = require('dockerode');

const docker = new Docker();
const FlowvizInstance = require('../models/FlowvizInstance');
let mongoose = require('mongoose');
const { link } = require('fs');

let numberOfTrees = workerData.flow.nodes.filter((link) => {
  console.log('Checking node', link.id);
  return !workerData.flow.links.map((link) => link.source).includes(link.id);
}).length;
console.log(numberOfTrees);

mongoose = require('mongoose'),
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

let tree_continue = true;

function run_flow() {
  create_flow_instance_in_database({
    _id: workerData.flow_run_id, flow: workerData.flow._id, nodes: workerData.flow.nodes, links: workerData.flow.links, on_error: workerData.flow.on_error, done: false, error: false,
  });

  const startTime = new Date();
  const refreshTime = setInterval(() => {
    set_flow_instance_in_database(
      workerData.flow_run_id,
      { runtime: engine.duration(startTime, Date.now()) },
    );
  }, 1000);
  console.log(workerData.flow);
  const first_linked_nodes = workerData.flow.links.filter((link) => link.source == 'node0').map((link_node) => link_node.target);
  first_linked_nodes.forEach((node_name) => {
    run_node(
      node_name,
      workerData.flow.nodes.filter((node) => node.id == node_name)[0].data.name,
      workerData.flow.links.filter((link) => link.source == node_name).map((link_node) => link_node.target),
      refreshTime,
      [].concat(
        workerData.flow.parameters,
        workerData.flow.shared,
        workerData.flow.booleans,
        workerData.flow.multis,
        workerData.flow.dynamic != undefined ? (workerData.flow.dynamic != 0 ? workerData.flow.dynamic.map((dynamo) => ({ key: dynamo.name, value: dynamo.output })) : []) : [],
      ),
    );
  });
}

async function get_instance_obj(instance_name) {
  return new Promise((resolve, reject) => {
    Instance.findOne({ name: instance_name }).populate({
      path: 'block',
      model: Block,
    }).exec((error, data) => {
      resolve(data);
    });
  });
}

async function run_node(node_name, instance_name, next_nodes, refreshTime, extraEnv) {
  const run_id = new mongoose.Types.ObjectId().toHexString();
  const inst_obj = await Promise.resolve(get_instance_obj(instance_name));
  console.log('Running node', node_name, 'with', instance_name, 'run_id', run_id, 'extraEnv', extraEnv);
  engine.run(inst_obj, run_id, JSON.parse(JSON.stringify(extraEnv)));
  const results = await Promise.resolve(run_finished(node_name, run_id));
  if (tree_continue) {
    if (results.error) {
      if (workerData.flow.on_error == 'continue') {
        if (next_nodes.length != 0) {
          next_nodes_run(next_nodes, refreshTime, results.extra_env);
        } else {
          stop_worker(refreshTime);
        }
      } else if (workerData.flow.on_error == 'branch') {
        skip_next_nodes(next_nodes, refreshTime);
      } else if (workerData.flow.on_error == 'tree') {
        tree_continue = false;
        skip_next_nodes(next_nodes, refreshTime);
      }
    } else if (next_nodes.length != 0) {
      next_nodes_run(next_nodes, refreshTime, results.extra_env);
    } else {
      stop_worker(refreshTime);
    }
  } else {
    skip_next_nodes(next_nodes, refreshTime);
  }
}

function skip_next_nodes(next_nodes, refreshTime) {
  if (next_nodes.length != 0) {
    next_nodes.forEach((next_node) => {
      set_flow_instance_in_database_with_node_name(
        workerData.flow_run_id,
        next_node,
        {
          'nodes.$[outer].error': false,
          'nodes.$[outer].skipped': true,
          'nodes.$[outer].runtime': 0,
          'nodes.$[outer].done': true,
        },
      );
      skip_next_nodes(workerData.flow.links.filter((link) => link.source == next_node).map((link_node) => link_node.target), refreshTime);
    });
  } else {
    stop_worker(refreshTime);
  }
}

function next_nodes_run(next_nodes, refreshTime, extra_env) {
  next_nodes.forEach((next_node) => {
    run_node(next_node, workerData.flow.nodes.filter((node) => node.id == next_node)[0].data.name, workerData.flow.links.filter((link) => link.source == next_node).map((link_node) => link_node.target), refreshTime, extra_env);
  });
}
function stop_worker(refreshTime) {
  console.log('Removing Number of trees by', 1);
  numberOfTrees--;
  console.log('Number of Trees:', numberOfTrees);
  if (numberOfTrees == 0) {
    clearInterval(refreshTime);
    set_flow_instance_in_database(
      workerData.flow_run_id,
      { done: true },
    );
    parentPort.postMessage('Done');
  }
}

async function run_finished(node_name, run_id) {
  return new Promise((resolve) => {
    nodeRunTime = 0;
    const nodeTime = setInterval(() => {
      nodeRunTime++;
    }, 1000);
    set_flow_instance_in_database_with_node_name(
      workerData.flow_run_id,
      node_name,
      { 'nodes.$[outer].done': false },
    );
    DockerInstance.watch()
      .on('change', (data) => {
        if ('updateDescription' in data) {
          if ('updatedFields' in data.updateDescription) {
            if ('done' in data.updateDescription.updatedFields) {
              if (run_id == data.documentKey._id.toString() && (data.updateDescription.updatedFields.done == true)) {
                // DockerInstance.findById(run_id, (error, dockerinst) => {
                //   var container = docker.getContainer(dockerinst.container_id);

                //   // query API for container info
                //   container.inspect(function (err, data) {
                //     console.log("container data")
                //     console.log(data);
                //   });
                // })

                DockerInstance.findById(run_id, (error, dockerinst) => {
                  if (data.updateDescription.updatedFields.error) {
                    set_flow_instance_in_database_with_node_name(
                      workerData.flow_run_id,
                      node_name,
                      {
                        'nodes.$[outer].error': true,
                        'nodes.$[outer].skipped': false,
                        'nodes.$[outer].runtime': nodeRunTime,
                        'nodes.$[outer].done': true,
                        'nodes.$[outer].run_id': run_id,
                        'nodes.$[outer].instance_id': dockerinst.instance,
                        error: true,
                      },
                    );
                  } else {
                    set_flow_instance_in_database_with_node_name(
                      workerData.flow_run_id,
                      node_name,
                      {
                        'nodes.$[outer].error': false,
                        'nodes.$[outer].skipped': false,
                        'nodes.$[outer].runtime': nodeRunTime,
                        'nodes.$[outer].done': true,
                        'nodes.$[outer].run_id': run_id,
                        'nodes.$[outer].instance_id': dockerinst.instance,
                      },
                    );
                  }
                  clearInterval(nodeTime);
                  resolve({ extra_env: dockerinst.parameters.concat(dockerinst.output), error: data.updateDescription.updatedFields.error });
                });
              }
            }
          }
        }
      });
  });
}

function create_flow_instance_in_database(flow_instance_body) {
  FlowvizInstance.create(flow_instance_body, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      // docker.run_flow(data._id)
      console.log('Flow Instance Created');
    }
  });
}

function set_flow_instance_in_database(generated_id, flow_body) {
  FlowvizInstance.findByIdAndUpdate(generated_id, {
    $set: flow_body,
  }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Set Time', flow_body);
    }
  });
}

function set_flow_instance_in_database_with_node_name(generated_id, node_name, flow_body) {
  FlowvizInstance.findByIdAndUpdate(
    generated_id,
    {
      $set: flow_body,
    },
    {
      arrayFilters: [{ 'outer.id': node_name }],
    },
    (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Set Time', flow_body);
      }
    },
  );
}
