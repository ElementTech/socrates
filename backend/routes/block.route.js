const express = require('express');
const app = express();
const blockRoute = express.Router();

// Block model
let Block = require('../models/Block');
let Instance = require('../models/Instance');

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
      console.log(error)
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

module.exports = blockRoute;