const express = require('express');
const app = express();
const DynamicParameterRoute = express.Router();
let DockerInstance = require('../models/DockerInstance');
var docker = require('../engine/docker');
// DynamicParameter model
let mongoose = require('mongoose');
let DynamicParameter = require('../models/DynamicParameter');
const auth = require("../middleware/auth");
DynamicParameterRoute.use(auth)
// Add DynamicParameter
DynamicParameterRoute.route('/create').post((req, res, next) => {
  DynamicParameter.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All DynamicParameters
DynamicParameterRoute.route('/').get((req, res) => {
  DynamicParameter.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single DynamicParameter
DynamicParameterRoute.route('/read/:id').get((req, res) => {
  DynamicParameter.findOne({id:req.params.id}, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update DynamicParameter
DynamicParameterRoute.route('/update/:id').put((req, res, next) => {
  console.log(req.body)
  DynamicParameter.findByIdAndUpdate(req.params.id, {
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

// Delete parameter
DynamicParameterRoute.route('/delete/:id').delete((req, res, next) => {
  DynamicParameter.findByIdAndRemove(req.params.id, (error, data) => {
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

DynamicParameterRoute.route('/run').post((req, res) => {

  
      const custom_id = new mongoose.Types.ObjectId().toHexString()
      console.log(req.body)
      docker.run(Object.assign({"block": {"lang":req.body.lang,"script":req.body.script,"prescript":""},
      "parameters": [{"key":"","value":""}],
      "shared": [],
      "booleans": [],
      "multis": []
    },{}),custom_id)


    res.json(custom_id)

})


module.exports = DynamicParameterRoute;