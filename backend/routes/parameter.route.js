const express = require('express');
const app = express();
const parameterRoute = express.Router();


// Parameter model
let Parameter = require('../models/Parameter');
let Block = require('../models/Block');
let Instance = require('../models/Instance');
const auth = require("../middleware/auth");
parameterRoute.use(auth)
// Add Parameter
parameterRoute.route('/create').post((req, res, next) => {
  Parameter.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});


// Add Parameter
parameterRoute.route('/bulk').post(async (req, res, next) => {
  //Optionally, overwrite schema-wide configuration
  // const config = {matchFields: ['foo', 'bar.nested']};

  //Perform bulk operation , config
  const config = {matchFields: ['key']};
  const result = await Parameter.upsertMany(req.body,config);
  
  Parameter.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      data.forEach(param => {

        Block.updateMany({'shared.key': param.key}, {'$set': {
          'shared.$.value': param.value,
          'shared.$.secret': param.secret
        }}, function(err) {
        })
        Instance.updateMany({'shared.key': param.key}, {'$set': {
          'shared.$.value': param.value,
          'shared.$.secret': param.secret
        }}, function(err) {
        })
      });
 
    }
  })
  

  //Returns promise with MongoDB bulk result object
  
  res.json("Done")
   
});

// Get All Parameters
parameterRoute.route('/').get((req, res) => {
  Parameter.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single parameter
parameterRoute.route('/read/:id').get((req, res) => {
  Parameter.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update parameter
parameterRoute.route('/update/:id').put((req, res, next) => {
  Parameter.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Delete parameter
parameterRoute.route('/delete/:id').delete((req, res, next) => {
  Parameter.findByIdAndRemove(req.params.id, (error, data) => {
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

module.exports = parameterRoute;