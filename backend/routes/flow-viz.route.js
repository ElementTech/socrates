const express = require('express');
const docker = require('../engine/docker');

const app = express();
const flowvizRoute = express.Router();
const mongoose = require('mongoose');
// Flowviz model
const Flowviz = require('../models/Flowviz');
const FlowvizInstance = require('../models/FlowvizInstance');
// let Instance = require('../models/Instance');
const auth = require('../middleware/auth');
const cronController = require('../controllers/cron.controller')
const FileElement = require('../models/FileElement')
const agenda = cronController.agenda
flowvizRoute.use(auth);
// Add Flowviz
flowvizRoute.route('/create').post((req, res, next) => {

    /*	#swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/Flowviz"
                    }  
                }
            }
    } */


  Flowviz.create(Object.assign(req.body, { user: req.user._id }), (error, data) => {
    if (error) {
      console.log(error)
      res.status(400).json(error)
      return next(error)
    } 
      res.json(data)
    
  });
});

// Get All Flowvizs
flowvizRoute.route('/').get((req, res, next) => {
  Flowviz.find({}).populate('user').exec((error, data) => {
    if (error) {
      return next(error)
    } 
      res.json(data)
    
  });
});

// Get single flowviz
flowvizRoute.route('/read/:id').get((req, res, next) => {
  Flowviz.findById(req.params.id).populate('user').exec((error, data) => {
    if (error) {
      console.log(error)
      return next(error)
    } 
      res.json(data)
    
  });
});

// Update flowviz
flowvizRoute.route('/update/:id').put((req, res, next) => {
  Flowviz.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, (error, data) => {
    if (error) {
      res.status(500).json(error)
      return next(error);
    } 
      res.json(data)
      console.log('Data updated successfully')
    
  });
});

// Delete flowviz
flowvizRoute.route('/delete/:id').delete((req, res, next) => {
  Flowviz.findByIdAndRemove(req.params.id, async (error, data) => {
    await agenda.cancel({ name: ("dag-"+data.name) });
    FileElement.deleteMany({fileid: req.params.id}).exec();
    console.log("Removing: " + req.params.id)
    if (error) {
      return next(error);
    } 
      res.status(200).json({
        msg: data
      })
    
  });
});

flowvizRoute.route('/run').post((req, res, next) => {
  Flowviz.findById(req.body.id).exec((error, data)=> {
    if (error) {
      return next(error);
    } else {
        const flowviz_run_id = new mongoose.Types.ObjectId().toHexString();
      docker.run_flowviz({ ...data.toJSON(),
        "parameters": req.body.parameters,
        "shared": req.body.shared,
        "booleans": req.body.booleans,
        "multis": req.body.multis,
        "dynamic": req.body.dynamic,
        "user": req.user._id
      }, flowviz_run_id);
      res.json(flowviz_run_id);

    }
  });
});

const cron = require('cron-validator');
flowvizRoute.route('/cron').post((req, res, next) => {
  Flowviz.findById(req.body.id).exec((error, data)=> {
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
      cronController.createDagFlow(req.body.interval,data)
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
flowvizRoute.route('/instance/one/read/:id').get((req, res, next) => {
  FlowvizInstance.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } 

      res.json(data)
    
  });
});

// Get All Flowviz Instances of a specific flowviz ID
flowvizRoute.route('/instance/read/:id').get((req, res, next) => {
  FlowvizInstance.find({ flow: req.params.id }).populate('user').sort({ _id: -1 }).exec((error,data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get All Dockers stats of a specific instance ID
flowvizRoute.route('/instance/read/stats/:id').get((req, res, next) => {
  FlowvizInstance.find({ flow: req.params.id }).exec((error,data) => {
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
flowvizRoute.route('/instance/update/:id').put((req, res, next) => {
  FlowvizInstance.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, (error, data) => {
    if (error) {
      return next(error);
    } 
      res.json(data)
      console.log('Data updated successfully')
    
  });
});

// Delete docker
flowvizRoute.route('/instance/delete/:id').delete((req, res, next) => {
  FlowvizInstance.findByIdAndRemove(req.params.id, (error, data) => {
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

module.exports = flowvizRoute;
