const express = require('express');

const app = express();
const UserRoute = express.Router();

// User model
const User = require('../models/users');
const auth = require('../middleware/auth');

UserRoute.use(auth);
// Add User
UserRoute.route('/create').post((req, res, next) => {
  User.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Get All Users
UserRoute.route('/').get((req, res) => {
  User.find((error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Get single User
UserRoute.route('/read/:id').get((req, res) => {
  User.findOne({ id: req.params.id }, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Update User
UserRoute.route('/update/:id').put((req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
    console.log('Data updated successfully');
  });
});

// Delete parameter
UserRoute.route('/delete/:id').delete((req, res, next) => {
  User.findByIdAndRemove(req.params.id, (error, data) => {
    console.log(`Removing: ${req.params.id}`);
    if (error) {
      return next(error);
    }
    res.status(200).json({
      msg: data,
    });
  });
});

module.exports = UserRoute;
