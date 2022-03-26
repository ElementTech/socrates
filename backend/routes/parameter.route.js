const express = require('express');

const app = express();
const parameterRoute = express.Router();

// Parameter model
const Parameter = require('../models/Parameter');
const Block = require('../models/Block');
const Instance = require('../models/Instance');
const auth = require('../middleware/auth');

parameterRoute.use(auth);
// Add Parameter
parameterRoute.route('/create').post((req, res, next) => {
  Parameter.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Add Parameter
parameterRoute.route('/bulk').post(async (req, res, next) => {
  // Optionally, overwrite schema-wide configuration
  // const config = {matchFields: ['foo', 'bar.nested']};

  // Perform bulk operation , config
  const config = { matchFields: ['key'] };
  const result = await Parameter.upsertMany(req.body, config);

  Parameter.find((error, data) => {
    if (error) {
      return next(error);
    }
    data.forEach((param) => {
      Block.updateMany({ 'shared.key': param.key }, {
        $set: {
          'shared.$.value': param.value,
          'shared.$.secret': param.secret,
        },
      }, (err) => {
      });
      Instance.updateMany({ 'shared.key': param.key }, {
        $set: {
          'shared.$.value': param.value,
          'shared.$.secret': param.secret,
        },
      }, (err) => {
      });
    });
  });

  // Returns promise with MongoDB bulk result object

  res.json('Done');
});

// Get All Parameters
parameterRoute.route('/').get((req, res) => {
  Parameter.find((error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Get single parameter
parameterRoute.route('/read/:id').get((req, res) => {
  Parameter.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Update parameter
parameterRoute.route('/update/:id').put((req, res, next) => {
  Parameter.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, { upsert: true, new: true }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error);
    }
    res.json(data);
    console.log('Data updated successfully');
  });
});

// Delete parameter
parameterRoute.route('/delete/:id').delete((req, res, next) => {
  Parameter.findByIdAndRemove(req.params.id, (error, data) => {
    console.log(`Removing: ${req.params.id}`);
    if (error) {
      return next(error);
    }
    res.status(200).json({
      msg: data,
    });
  });
});

module.exports = parameterRoute;
