const express = require('express');

const app = express();
const GithubRoute = express.Router();
const auth = require('../middleware/auth');

GithubRoute.use(auth);
// Github model
const Github = require('../models/GithubElement');

// Add Github
GithubRoute.route('/create').post((req, res, next) => {
  Github.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Get All Githubs
GithubRoute.route('/').get((req, res) => {
  Github.find((error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Get single Github
GithubRoute.route('/read/:id').get((req, res) => {
  Github.findOne({ id: req.params.id }, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Update Github
GithubRoute.route('/update/:id').put((req, res, next) => {
  Github.findOneAndUpdate({ id: req.params.id }, {
    $set: req.body,
  }, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
    console.log('Data updated successfully');
  });
});

// Delete Github
GithubRoute.route('/delete/:id').delete((req, res, next) => {
  Github.findOneAndRemove({ id: req.params.id }, (error, data) => {
    console.log(`Removing: ${req.params.id}`);
    if (error) {
      return next(error);
    }
    res.status(200).json({
      msg: data,
    });
  });
});

module.exports = GithubRoute;
