const express = require('express');
const schedulerRoute = express.Router();
const cronController = require('../controllers/cron.controller')
const agenda = cronController.agenda
const auth = require('../middleware/auth');
const CronRun = require('../models/CronRun');
schedulerRoute.use(auth);

// // Add Block
// schedulerRoute.route('/create').post((req, res, next) => {
//   cronController.
// });

// Get All Blocks
schedulerRoute.route('/').get(async (req, res, next) => {
  const jobs = await agenda.jobs();
  res.json(jobs)
});

schedulerRoute.route('/runs').get(async (req, res, next) => {
  CronRun.find((error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Get single block
schedulerRoute.route('/read/:name').get(async (req, res, next) => {
  const jobs = await agenda.jobs({ name: req.params.name });
  res.json(jobs)
});

// // Update block
// schedulerRoute.route('/update/:name').put((req, res, next) => {

// });

// Delete block
schedulerRoute.route('/delete/:name').delete(async (req, res, next) => {
  const numRemoved = await agenda.cancel({ name: req.params.name });
  console.log("deleted",req.params)
  res.json(numRemoved)
});

module.exports = schedulerRoute;
