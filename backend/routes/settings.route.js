const express = require('express');
const app = express();
const settingsRoute = express.Router();

// Settings model
let Settings = require('../models/Settings');

// Add Settings
settingsRoute.route('/create').post((req, res, next) => {
  Settings.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Settingss
settingsRoute.route('/').get((req, res) => {
  Settings.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single settings
settingsRoute.route('/read/:id').get((req, res) => {
  Settings.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update settings
settingsRoute.route('/update/:id').put((req, res, next) => {
  Settings.findByIdAndUpdate(req.params.id, {
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

// Delete settings
settingsRoute.route('/delete/:id').delete((req, res, next) => {
  Settings.findByIdAndRemove(req.params.id, (error, data) => {
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

module.exports = settingsRoute;