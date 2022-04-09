const express = require('express');

const app = express();
const dashboardRoute = express.Router();
const auth = require('../middleware/auth');

dashboardRoute.use(auth);
dbConfig = require('../database/db');

const Block = require('../models/Block');
const Instance = require('../models/Instance');
const DockerInstance = require('../models/DockerInstance');
const FlowInstance = require('../models/FlowInstance');
const FlowvizInstance = require('../models/FlowvizInstance');

dashboardRoute.route('/').get(async (req, res, next) => {
//     mongoose = require('mongoose'),
//     mongoose.Promise = global.Promise;
//     mongoose.connect(dbConfig.db, {useNewUrlParser: true,
// 
// 
// connectTimeoutMS: 20000,
// socketTimeoutMS: 45000})
  // var db = mongoose.connection;
  // db.on('error', console.error.bind(console, 'connection error:'));
  // db.once('open', async function() {
  // db.db.stats({scale:1024*1024*1024},async function(err, stats) {
  const instance = await Instance.find();
  const instanceStats = {
    count: instance.length,
  };
  const block = await Block.find();
  const blockStats = {
    langs: Object.entries(block.reduce((resultObj, obj) => { (obj.lang in resultObj) ? resultObj[obj.lang]++ : resultObj[obj.lang] = 1; return resultObj; }, {})).map((e) => ({ name: [e[0]], value: e[1] })),
    github: block.filter((obj) => obj.github).length,
    count: block.length,
    used: block.length - block.filter((obj) => (instance.filter((inst) => inst.block == obj._id.toString()) == 0)).length,
  };
  const docker = await DockerInstance.find();
  const dockerStats = {
    count: docker.length,
    done: docker.filter((obj) => obj.done).length,
    running: docker.filter((obj) => !obj.done).length,
    error: docker.filter((obj) => obj.error).length,
  };
  const step = await FlowInstance.find();
  const stepStats = {
    count: step.length,
    done: step.filter((obj) => obj.done).length,
    running: step.filter((obj) => !obj.done).length,
    error: step.filter((obj) => obj.error).length,
  };
  const dag = await FlowvizInstance.find();
  const dagStats = {
    count: dag.length,
    done: dag.filter((obj) => obj.done).length,
    running: dag.filter((obj) => !obj.done).length,
    error: dag.filter((obj) => obj.error).length,
  };
  // "server":(stats ? stats : {})}
  res.json({
    block: blockStats, instance: instanceStats, docker: dockerStats, step: stepStats, dag: dagStats,
  });
  // });
  // });
});

dashboardRoute.route('/runs').get(async (req, res, next) => {
  const docker_runs = await DockerInstance.aggregate([
    { 
      $addFields: {
         component_id: { $toObjectId: "$instance" },
         user_id: { $toObjectId: "$user" }
        }
    },
    {
      $lookup:
       {
         from: "instances",
         localField: "component_id",
         foreignField: "_id",
         as: "instance_docs"
       }
    },{
      $lookup:
         {
           from: "users",
           localField: "user_id",
           foreignField: "_id",
           as: "username"
         }
      },
    {
    $project: 
    {
      _id: 1,
      done : 1,
      error: 1,
      type : "instance",
      component: "$instance",
      name: {$arrayElemAt: ["$instance_docs.name",0]},
      updatedAt : 1,
      runtime: 1,
      user: {$arrayElemAt: ["$username.name",0]}
    },
  },
  { 
    $sort: 
      { 
        updatedAt: -1 
      } 
    },
    {
      $limit: 20
    }
  ])
  const step_runs = await FlowInstance.aggregate([{ 
    $addFields: {
       component_id: { $toObjectId: "$flow" },
       user_id: { $toObjectId: "$user" }
      }
  },
  {
  $lookup:
     {
       from: "flows",
       localField: "component_id",
       foreignField: "_id",
       as: "flow_docs"
     }
},{
  $lookup:
     {
       from: "users",
       localField: "user_id",
       foreignField: "_id",
       as: "username"
     }
  },{
    $project: {
      _id: 1,
      done : 1,
      error: 1,
      type : "step",
      component: "$flow",
      name: {$arrayElemAt: ["$flow_docs.name",0]},
      updatedAt : 1,
      runtime: 1,
      user: {$arrayElemAt: ["$username.name",0]}
    }
  },{ $sort: { updatedAt: -1 } },{$limit: 20}])
  const dag_runs = await FlowvizInstance.aggregate([{ 
    $addFields: {
       component_id: { $toObjectId: "$flow" },
       user_id: { $toObjectId: "$user" }
      }
  },
  {
  $lookup:
     {
       from: "flows_viz",
       localField: "component_id",
       foreignField: "_id",
       as: "flow_docs"
     }
},
{
$lookup:
   {
     from: "users",
     localField: "user_id",
     foreignField: "_id",
     as: "username"
   }
},{
    $project: {
      _id: 1,
      done : 1,
      error: 1,
      type : "dag",
      component: "$flow",
      name: {$arrayElemAt: ["$flow_docs.name",0]},
      updatedAt : 1,
      runtime: 1,
      user: {$arrayElemAt: ["$username.name",0]}
    }
  },{ $sort: { updatedAt: -1 } },{$limit: 20}])
  res.json([].concat(docker_runs,step_runs,dag_runs).sort(function(a,b){
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  }))
});

module.exports = dashboardRoute;
