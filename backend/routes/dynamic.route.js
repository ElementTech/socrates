const express = require('express');
const app = express();
const DynamicParameterRoute = express.Router();

// DynamicParameter model
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

module.exports = DynamicParameterRoute;