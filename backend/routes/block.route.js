const express = require('express');
const app = express();
const blockRoute = express.Router();

// Block model
let Block = require('../models/Block');
let Instance = require('../models/Instance');
let DockerInstance = require('../models/DockerInstance')
const auth = require("../middleware/auth");
blockRoute.use(auth)
// Add Block
blockRoute.route('/create').post((req, res, next) => {
  Block.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Blocks
blockRoute.route('/').get((req, res, next) => {
  Block.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single block
blockRoute.route('/read/:id').get((req, res, next) => {
  Block.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update block
blockRoute.route('/update/:id').put((req, res, next) => {
  Block.findByIdAndUpdate(req.params.id, {
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

// Delete block
blockRoute.route('/delete/:id').delete((req, res, next) => {
  Instance.find({block: req.params.id}).exec(function(error,instance_data){
    if (error) {
      return next(error);
    } else {
      if (instance_data.length == 0){
        Block.findByIdAndRemove(req.params.id, (error, data) => {
          console.log("Removing: " + req.params.id)
          if (error) {
            return next(error);
          } else {
            res.status(200).json({
              msg: data
            })
          }
        })
      }
      else
      {
        res.status(406).json({
          msg: "Block Has Instances Attached"
        })
      }
    }
  });

})

// Get All Dockers stats of a specific instance ID
blockRoute.route('/stats/:id').get((req, res,next) => {
  Instance.find({ block: req.params.id }).exec(function(error,instances)
  { 
    if (error) {
      return next(error)
    } else {
      let numFail = 0
      let numSuccess = 0
      let avgRun = 0
      let runs = []
      let runsLength = 0
      let instancesCount = 0
      instances.forEach(elementInstance => {
        instancesCount++
        DockerInstance.find({ instance: elementInstance._id }).exec(function(error,data)
        { 
          if (error) {
            return next(error)
          } else {
            runsLength += data.length
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
                runs.push({"name":data.indexOf(element),"value":tempTimeSeconds,"instance": elementInstance.name})   
                if (runs.length == runsLength){
                  instancesCount--
                  
                  if (instancesCount == 0){
                    res.json({"fail": numFail,"success":numSuccess,"avg":secondsToHms(avgRun/runs.length),"runs":runs})
                  }
                } 
              }
              
            });
          }    
         
        });
       
      });
    }    
  });
})

function secondsToHms(d) {
  d = Number(d);
  var w = Math.floor(d / 604800)
  var y = Math.floor(d / 86400)
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600.0 % 60.0);
  var wDisplay = w > 0 ? w + (w == 1 ? " week, " : " weeks, ") : "";
  var yDisplay = y > 0 ? y + (y == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return wDisplay + yDisplay + hDisplay + mDisplay + sDisplay; 
}

module.exports = blockRoute;