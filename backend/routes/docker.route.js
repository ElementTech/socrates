const express = require('express');

const app = express();
const dockerRoute = express.Router();
let docker = require('../engine/docker');
let childProcess = require('child_process');

// Docker model
const DockerInstance = require('../models/DockerInstance');
const auth = require('../middleware/auth');

dockerRoute.use(auth);
// Add Docker
dockerRoute.route('/create').post((req, res, next) => {
  DockerInstance.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } 
      res.json(data)
    
  });
});

// Get All Dockers
dockerRoute.route('/').get((req, res, next) => {
  DockerInstance.find((error, data) => {
    if (error) {
      return next(error)
    } 
      res.json(data)
    
  });
});

// Get single docker
dockerRoute.route('/read/:id').get((req, res, next) => {
  DockerInstance.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } 
      res.json(data)
    
  });
});

// Update docker
dockerRoute.route('/update/:id').put((req, res, next) => {
  DockerInstance.findByIdAndUpdate(req.params.id, {
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
dockerRoute.route('/delete/:id').delete((req, res, next) => {
  DockerInstance.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } 
      res.status(200).json({
        msg: data
      })
    
  });
});

// Get All Dockers of a specific instance ID
dockerRoute.route('/instance/read/:id').get((req, res, next) => {
  DockerInstance.find({ instance: req.params.id }).sort({ _id: -1 }).exec((error,data)
  => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get All Dockers stats of a specific instance ID
dockerRoute.route('/instance/read/stats/:id').get((req, res, next) => {
  DockerInstance.find({ instance: req.params.id }).exec((error,data)
  => {
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

module.exports = dockerRoute;
