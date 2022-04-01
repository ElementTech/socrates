const express = require('express');

const app = express();
const FileRoute = express.Router();

// File model
const File = require('../models/FileElement');
const auth = require('../middleware/auth');

FileRoute.use(auth);
// Add File
FileRoute.route('/create').post((req, res, next) => {
  File.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Get All Files
FileRoute.route('/').get((req, res,next) => {
  File.find((error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Get single File
FileRoute.route('/read/:id').get((req, res,next) => {
  File.findOne({ id: req.params.id }, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Update File
FileRoute.route('/update/:id').put((req, res, next) => {
  File.findOneAndUpdate({ id: req.params.id }, {
    $set: req.body,
  }, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
    console.log('Data updated successfully');
  });
});

// Delete File
FileRoute.route('/delete/:id').delete((req, res, next) => {
  File.findOneAndRemove({ id: req.params.id }, (error, data) => {
    console.log(`Removing: ${req.params.id}`);
    if (error) {
      return next(error);
    }
    res.status(200).json({
      msg: data,
    });
  });
});

module.exports = FileRoute;
