const express = require('express');
const docker = require('../engine/docker');

const app = express();
const flowRoute = express.Router();
const mongoose = require('mongoose');
// Flow model
const Flow = require('../models/Flow');
const FlowInstance = require('../models/FlowInstance');
const Instance = require('../models/Instance');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth');
const cronController = require('../controllers/cron.controller')
flowRoute.use(auth);
// Add Flow
flowRoute.route('/create').post((req, res, next) => {
  const newSteps = [];
  req.body.steps.forEach((step)=> {
    tempStep = [];
    for (let index = 0; index < step.length; index++) {
      tempStep.push({ "num": index, "id": step[index]._id });
    }
    newSteps.push(tempStep);
  });
  req.body.steps = newSteps;
  Flow.create(Object.assign(req.body, { user: req.user._id }), (error, data) => {
    if (error) {
      res.status(400).json(error)
      return next(error)
    } 
      res.json(data)
    
  });
});

// Get All Flows
flowRoute.route('/').get((req, res, next) => {
  Flow.find({}).populate('user').exec((error, data) => {
    if (error) {
      return next(error)
    } 
      res.json(data)
    
  });
});

// Get single flow
flowRoute.route('/read/:id').get((req, res, next) => {
  Flow.findById(req.params.id).populate('user').exec((error, data) => {
    if (error) {
      return next(error)
    } 
    let populatedStepsPromises = []
    let populatedSteps = []
    for (let index = 0; index < data.steps.length; index++) {
      let step = data.steps[index];
      let tempStep = []
      for (let indexj = 0; indexj < step.length; indexj++) {      
        populatedStepsPromises.push(Instance.findById(step[indexj].id).exec().then(function(data) {tempStep.push({"num":step[indexj].num,"data":data})}))
      }
      populatedSteps.push(tempStep)
    }
    Promise.all(populatedStepsPromises).then(promiseResult => {
      data.steps = populatedSteps.map(step=>step.sort(function (a, b) {
        return a.num - b.num;
      }).map(inst=>JSON.stringify(inst)))
      res.send(data)
    });


    
  });
});

// Update flow
flowRoute.route('/update/:id').put((req, res, next) => {
  Flow.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, (error, data) => {
    if (error) {
      res.error(error)
      return next(error);
    } 
      res.json(data)
      console.log('Data updated successfully')
    
  });
});

// Delete flow
flowRoute.route('/delete/:id').delete((req, res, next) => {
  Flow.findByIdAndRemove(req.params.id, (error, data) => {
    console.log("Removing: " + req.params.id)
    if (error) {
      return next(error);
    } 
      res.status(200).json({
        msg: data
      })
    
  });
});

flowRoute.route('/run').post((req, res, next) => {
  Flow.findById(req.body.id).exec((error, data)=> {
    if (error) {
      return next(error);
    } else {
      const flow_run_id = new mongoose.Types.ObjectId().toHexString();
      docker.run_flow({ ...data.toJSON(),
        "parameters": req.body.parameters,
        "shared": req.body.shared,
        "booleans": req.body.booleans,
        "multis": req.body.multis,
        "dynamic": req.body.dynamic,
      }, flow_run_id);
      res.json(flow_run_id);
    }
  });
});
const cron = require('cron-validator');
flowRoute.route('/cron').post((req, res, next) => {
  Flow.findById(req.body.id).exec((error, data)=> {
    if (error) {
      return next(error);
    } else {
      if (cron.isValidCron(req.body.interval, { alias: true,allowBlankDay: true,allowSevenAsSunday: true })) {
        data = data.toJSON()
        data.parameters = req.body.parameters;
        data.shared = req.body.shared;
        data.booleans = req.body.booleans;
        data.multis = req.body.multis;
        data.dynamic = req.body.dynamic;
        cronController.createStepFlow(req.body.interval,data)
      }
      else
      {
        res.status(500).json({
          msg: "Invalid Cron"
        })
      }
    }
  });
});

// Get single docker
flowRoute.route('/instance/one/read/:id').get((req, res, next) => {
  FlowInstance.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } 
      res.json(data)
    
  });
});

// Get All Flow Instances of a specific flow ID
flowRoute.route('/instance/read/:id').get((req, res, next) => {
  FlowInstance.find({ flow: req.params.id }).sort({ _id: -1 }).exec((error,data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get All Dockers stats of a specific instance ID
flowRoute.route('/instance/read/stats/:id').get((req, res, next) => {
  FlowInstance.find({ flow: req.params.id }).exec((error,data) => {
    if (error) {
      return next(error);
    } else {
      let numFail = 0;
      let numSuccess = 0;
      let avgRun = 0;
      const numRuns = data.length
      const runs = []
      data.forEach((element) => {
        if (element.done == true) {
          if (element.error) {
            numFail++;
          } else {
            numSuccess++;
          }
          let tempTimeSeconds = 0;
          for (const key in element.runtime) {
            const timeElement = element.runtime[key];

            if (key == 'seconds') {
              avgRun += timeElement;
              tempTimeSeconds += timeElement;
            }
            if (key == 'minutes') {
              avgRun += timeElement * 60;
              tempTimeSeconds += timeElement * 60;
            }
            if (key == 'hours') {
              avgRun += timeElement * 60 * 60;
              tempTimeSeconds += timeElement * 60 * 60;
            }
            if (key == 'days') {
              avgRun += timeElement * 24 * 60 * 60;
              tempTimeSeconds += timeElement * 24 * 60 * 60;
            }
            if (key == 'weekdays') {
              avgRun += timeElement * 7 * 24 * 60 * 60;
              tempTimeSeconds += timeElement * 7 * 24 * 60 * 60;
            }
          }
          runs.push({ "name": data.indexOf(element), "value": tempTimeSeconds });    
        }
      });
      res.json({ "fail": numFail, "success": numSuccess, "avg": secondsToHms(avgRun / data.length), "runs": runs });
    }
  });
});

// Update docker
flowRoute.route('/instance/update/:id').put((req, res, next) => {
  FlowInstance.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } 
      res.json(data)
      console.log('Data updated successfully')
    
  });
});

// Delete docker
flowRoute.route('/instance/delete/:id').delete((req, res, next) => {
  FlowInstance.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } 
      res.status(200).json({
        msg: data
      })
    
  });
});

function secondsToHms(d) {
  d = Number(d);
  let w = Math.floor(d / 604800);
  let y = Math.floor(d / 86400);
  let h = Math.floor(d / 3600);
  let m = Math.floor(d % 3600 / 60);
  let s = Math.floor(d % 3600 % 60);

  let wDisplay = w > 0 ? w + (w == 1 ? ' week, ' : ' weeks, ') : '';
  let yDisplay = y > 0 ? y + (y == 1 ? ' day, ' : ' days, ') : '';
  let hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
  let mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
  let sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
  return wDisplay + yDisplay + hDisplay + mDisplay + sDisplay;
}

module.exports = flowRoute;
