const express = require('express');
const docker = require('../engine/docker');
const app = express();
const flowvizRoute = express.Router();
let mongoose = require('mongoose');
// Flowviz model
let Flowviz = require('../models/Flowviz');
let FlowvizInstance = require('../models/FlowvizInstance');
// let Instance = require('../models/Instance');
const auth = require("../middleware/auth");
flowvizRoute.use(auth)
// Add Flowviz
flowvizRoute.route('/create').post((req, res, next) => {
  Flowviz.create(req.body, (error, data) => {
    if (error) {
      console.log(error)
      res.status(400).json(error)
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Flowvizs
flowvizRoute.route('/').get((req, res, next) => {
  Flowviz.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single flowviz
flowvizRoute.route('/read/:id').get((req, res, next) => {
  Flowviz.findById(req.params.id, (error, data) => {
    if (error) {
      console.log(error)
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update flowviz
flowvizRoute.route('/update/:id').put((req, res, next) => {
  Flowviz.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      res.status(500).json(error)
      return next(error);
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Delete flowviz
flowvizRoute.route('/delete/:id').delete((req, res, next) => {
  Flowviz.findByIdAndRemove(req.params.id, (error, data) => {
    console.log("Removing: " + req.params.id)
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

flowvizRoute.route('/run').post((req, res, next) => {
  Flowviz.findById(req.body.id).exec(function(error, data){
      if (error) {
        return next(error)
      } else {

        const flowviz_run_id = new mongoose.Types.ObjectId().toHexString()
        docker.run_flowviz(data,flowviz_run_id)
        res.json(flowviz_run_id)
        
      }
  });
})

// Get single docker
flowvizRoute.route('/instance/one/read/:id').get((req, res, next) => {
  FlowvizInstance.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {

      res.json(data)
    }
  })
})

// Get All Flowviz Instances of a specific flowviz ID
flowvizRoute.route('/instance/read/:id').get((req, res,next) => {
  FlowvizInstance.find({ flow: req.params.id }).sort({_id: -1}).exec(function(error,data)
  { 
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }    
  });
})

// Get All Dockers stats of a specific instance ID
flowvizRoute.route('/instance/read/stats/:id').get((req, res,next) => {
  FlowvizInstance.find({ flow: req.params.id }).exec(function(error,data)
  { 
    if (error) {
      return next(error)
    } else {
      let numFail = 0
      let numSuccess = 0
      let avgRun = 0
      let numRuns = data.length
      let runs = []
      data.forEach(element => {
        if (element.done == true){
          if (element.error){
            numFail++
          }
          else
          {
            numSuccess++
          }
          let tempTimeSeconds = 0
          for (const key in element.runtime) {
              const timeElement = element.runtime[key];
              
              if (key == "seconds"){
                avgRun+=timeElement
                tempTimeSeconds+=timeElement
              }
              if (key == "minutes"){
                avgRun+=timeElement*60
                tempTimeSeconds+=timeElement*60
              }
              if (key == "hours"){
                avgRun+=timeElement*60*60
                tempTimeSeconds+=timeElement*60*60
              }
              if (key == "days"){
                avgRun+=timeElement*24*60*60
                tempTimeSeconds+=timeElement*24*60*60
              }
              if (key == "weekdays"){
                avgRun+=timeElement*7*24*60*60
                tempTimeSeconds+=timeElement*7*24*60*60
              }
          }
          runs.push({"name":data.indexOf(element),"value":tempTimeSeconds})    
        }
  
      });
      res.json({"fail": numFail,"success":numSuccess,"avg":secondsToHms(avgRun/data.length),"runs":runs})
    }    
  });
})

// Update docker
flowvizRoute.route('/instance/update/:id').put((req, res, next) => {
  FlowvizInstance.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Delete docker
flowvizRoute.route('/instance/delete/:id').delete((req, res, next) => {
  FlowvizInstance.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

function secondsToHms(d) {
  d = Number(d);
  var w = Math.floor(d / 604800)
  var y = Math.floor(d / 86400)
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var wDisplay = w > 0 ? w + (w == 1 ? " week, " : " weeks, ") : "";
  var yDisplay = y > 0 ? y + (y == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return wDisplay + yDisplay + hDisplay + mDisplay + sDisplay; 
}

module.exports = flowvizRoute;