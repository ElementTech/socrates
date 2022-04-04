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

module.exports = dashboardRoute;
