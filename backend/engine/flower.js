//add this script in myWorker.js file
const {parentPort, workerData} = require("worker_threads");
let DockerInstance = require('../models/DockerInstance');
dbConfig = require('../database/db');
var engine = require('./docker');
let Instance = require('../models/Instance');
let Block = require('../models/Block');
let FlowInstance = require('../models/FlowInstance')
let mongoose = require('mongoose');

mongoose = require('mongoose'),
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
   useNewUrlParser: true
}).then(() => {
      console.log('Database sucessfully connected')
      run_flow()
   },
   error => {
      console.log('Database could not connected: ' + error)
      process.exit(error)
   }
)



async function run_flow(){

  let run_ids = await Promise.resolve(asyncSearch(workerData.flow.steps,workerData.flow.steps.length))
  create_flow_instance_in_database({_id: workerData.flow_run_id,"flow": workerData.flow._id, "run": run_ids,"done": false,"error": false})
  var generalEnv = await Promise.resolve(calculate_general_envs(run_ids))
  const startTime = new Date()
  const refreshTime = setInterval(function() {
  
    set_flow_instance_in_database(workerData.flow_run_id,
      {runtime: engine.duration(startTime,Date.now())}
    )
   
  }, 1000);
  // Calculate Env
  
  // Before
  for (const step of run_ids) // During
  {
    let stepRunIds = []
    for (const run_object of step) 
    {
      Instance.findById(run_object.id).populate({
        path: 'block',
        model: Block 
        }).exec(function(error, data){
        if (error) {
          console.log(error)
          return error
        } else {
          stepRunIds.push(run_object.run_id)
          engine.run(data,run_object.run_id,generalEnv)
        }
      })
    }
    await Promise.resolve(wait_for_equal(stepRunIds,workerData.flow_run_id));
  }
  //After
  clearInterval(refreshTime);
  set_flow_instance_in_database(workerData.flow_run_id,
    { done: true }
  )
  parentPort.postMessage("Done")
}

function asyncSearch(steps,maxlength) {
  return new Promise((resolve, reject) => {
    let run_ids = []
    for (let index = 0; index < steps.length; index++) {
      const element = steps[index];
      let step = []
      for (let indexj = 0; indexj < element.length; indexj++) {
        const inst = element[indexj];
        step.push({id: inst.id,run_id: new mongoose.Types.ObjectId().toHexString(),ui_id: index.toString()+indexj.toString()})
      }
      run_ids.push(step)
      if (run_ids.length == maxlength){
        resolve(run_ids)
      }
    }

  })
}

async function calculate_general_envs(run_ids){
 
  return new Promise(resolve => {
    let generalEnvVars = []
    for (const step of run_ids) // During
    {
      for (const run_object of step) 
      {
        Instance.findById(run_object.id, (error,doc) =>{
          generalEnvVars = generalEnvVars.concat(doc.parameters).concat(doc.shared)
          if (generalEnvVars.length >= run_ids.length)
          {
            resolve(generalEnvVars)
          }
        });
      }
    }
    
  });
}

async function wait_for_equal(stepRunIds,flow_run_id) {
  return new Promise(resolve => {
      let finished = 0
      DockerInstance.watch().
        on('change', data => {
          if ("updateDescription" in data)
          {
            if ("updatedFields" in data.updateDescription)
            {
              if ("done" in data.updateDescription.updatedFields) {
                
                if ((stepRunIds.includes(data.documentKey._id.toString())) && (data.updateDescription.updatedFields.done == true))
                {
                  if (data.updateDescription.updatedFields.error)
                  {
                    set_flow_instance_in_database(flow_run_id,
                      { error: true }
                    )
                  }
                  if ((finished+1) == stepRunIds.length) {
                    resolve(true)
                  }
                  else{
                    finished++
                  }
                }
              }
            }
          }
      });
  });
}

function create_flow_instance_in_database(flow_instance_body){
  FlowInstance.create(flow_instance_body, (error, data) => {
    if (error) {
      console.log(error)
    } else {
      //docker.run_flow(data._id)
      console.log("Flow Instance Created")
    }
  })
}

function set_flow_instance_in_database(generated_id,flow_body) {
  FlowInstance.findByIdAndUpdate(generated_id, {
    $set: flow_body
  }, (error, data) => {
    if (error) {
      console.log(error)
    } else {
      
    }
  })
}