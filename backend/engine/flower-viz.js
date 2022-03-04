//add this script in myWorker.js file
const {parentPort, workerData} = require("worker_threads");
let DockerInstance = require('../models/DockerInstance');
dbConfig = require('../database/db');
var engine = require('./docker');
let Instance = require('../models/Instance');
let Block = require('../models/Block');
var Docker = require('dockerode');
var docker = new Docker();
let FlowvizInstance = require('../models/FlowvizInstance')
let mongoose = require('mongoose');
const { link } = require("fs");

let numberOfTrees = workerData.flow.nodes.filter(link=>{
  console.log("Checking node",link.id)
  return !workerData.flow.links.map(link=>{
    return link.source
  }).includes(link.id)
}).length
console.log(numberOfTrees)

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

function run_flow(){
  create_flow_instance_in_database({_id: workerData.flow_run_id,"flow": workerData.flow._id, "nodes": workerData.flow.nodes,"links":workerData.flow.links,"done": false,"error": false})
  const startTime = new Date()
  const refreshTime = setInterval(function() {
    set_flow_instance_in_database(workerData.flow_run_id,
      {runtime: engine.duration(startTime,Date.now())}
    )
  }, 1000);
  const first_linked_nodes = workerData.flow.links.filter(link=>link.source=="node0").map(link_node=>link_node.target)
  first_linked_nodes.forEach(node_name => {
    run_node(node_name,workerData.flow.nodes.filter(node=>node.id==node_name)[0].data.name,workerData.flow.links.filter(link=>link.source==node_name).map(link_node=>link_node.target),refreshTime)
  });
}

async function get_instance_obj(instance_name)
{
  return new Promise((resolve, reject) => {
    Instance.findOne({name:instance_name}).populate({
      path: 'block',
      model: Block 
      }).exec(function(error, data){
        resolve(data)
    });
  })
}

async function run_node(node_name,instance_name,next_nodes,refreshTime,extraEnv) {
  const run_id = new mongoose.Types.ObjectId().toHexString()
  const inst_obj = await Promise.resolve(get_instance_obj(instance_name))
  console.log("Running node",node_name,"with",instance_name,"run_id",run_id,"inst_obj",inst_obj)
  engine.run(inst_obj,run_id,false,extraEnv)
  extra_env = await Promise.resolve(run_finished(node_name,run_id));
  if (next_nodes.length != 0)
  {
    next_nodes.forEach(next_node => {
      run_node(next_node,workerData.flow.nodes.filter(node=>node.id==next_node)[0].data.name,workerData.flow.links.filter(link=>link.source==next_node).map(link_node=>link_node.target),refreshTime,extra_env)
    });
  }
  else
  {
    console.log("Removing Number of trees by",1)
    numberOfTrees--
    console.log("Number of Trees:",numberOfTrees)
    if (numberOfTrees==0)
    {
      clearInterval(refreshTime);
      set_flow_instance_in_database(workerData.flow_run_id,
        { done: true }
      )
      parentPort.postMessage("Done")
    }
  }
}

async function run_finished(node_name,run_id) {
  return new Promise(resolve => {
      nodeRunTime = 0
      const nodeTime = setInterval(function() {
        nodeRunTime++
      }, 1000);
      set_flow_instance_in_database_with_node_name(workerData.flow_run_id,node_name,
        { [`nodes.$[outer].done`]: false }
      )
      DockerInstance.watch().
        on('change', data => {
          if ("updateDescription" in data)
          {
            if ("updatedFields" in data.updateDescription)
            {
              if ("done" in data.updateDescription.updatedFields) {
                
                if (run_id == data.documentKey._id.toString() && (data.updateDescription.updatedFields.done == true))
                {
                  // DockerInstance.findById(run_id, (error, dockerinst) => {
                  //   var container = docker.getContainer(dockerinst.container_id);

                  //   // query API for container info
                  //   container.inspect(function (err, data) {
                  //     console.log("container data")
                  //     console.log(data);
                  //   });
                  // })

                  if (data.updateDescription.updatedFields.error)
                  {
                    set_flow_instance_in_database_with_node_name(workerData.flow_run_id,node_name,
                      { [`nodes.$[outer].error`]: true,
                        [`nodes.$[outer].runtime`]: nodeRunTime,
                        [`nodes.$[outer].done`]: true,
                        error: true 
                      }
                    )
                  }
                  else
                  {
                    set_flow_instance_in_database_with_node_name(workerData.flow_run_id,node_name,
                      { 
                        [`nodes.$[outer].error`]: false,
                        [`nodes.$[outer].runtime`]: nodeRunTime,
                        [`nodes.$[outer].done`]: true
                      }
                    )
                  }
                  clearInterval(nodeTime);
                  DockerInstance.findById(run_id, (error, dockerinst) => {
                    resolve(dockerinst.output)
                  });
                }
              }
            }
          }
      });
  });
}

function create_flow_instance_in_database(flow_instance_body){
  FlowvizInstance.create(flow_instance_body, (error, data) => {
    if (error) {
      console.log(error)
    } else {
      //docker.run_flow(data._id)
      console.log("Flow Instance Created")
    }
  })
}

function set_flow_instance_in_database(generated_id,flow_body) {
  FlowvizInstance.findByIdAndUpdate(generated_id, {
    $set: flow_body
  }, (error, data) => {
    if (error) {
      console.log(error)
    } else {
      console.log("Set Time",flow_body) 
    }
  })
}

function set_flow_instance_in_database_with_node_name(generated_id,node_name,flow_body) {
  FlowvizInstance.findByIdAndUpdate(generated_id, {
    $set: flow_body
  },
  { 
    "arrayFilters": [{ "outer.id": node_name }]
  }, (error, data) => {
    if (error) {
      console.log(error)
    } else {
      console.log("Set Time",flow_body) 
    }
  })
}