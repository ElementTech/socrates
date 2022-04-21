const express = require('express');

const app = express();
const DynamicParameterRoute = express.Router();
const mongoose = require('mongoose');
const DockerInstance = require('../models/DockerInstance');
const docker = require('../engine/docker');
// DynamicParameter model
const DynamicParameter = require('../models/DynamicParameter');
const auth = require('../middleware/auth');
const { Worker } = require('worker_threads');
DynamicParameterRoute.use(auth);
// Add DynamicParameter
DynamicParameterRoute.route('/create').post((req, res, next) => {


    /*	#swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/DynamicParameter"
                    }  
                }
            }
    } */

  DynamicParameter.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    }
    updateDynamicParameter(data._id)
    res.json(data);
  });
});

// Get All DynamicParameters
DynamicParameterRoute.route('/').get((req, res) => {
  DynamicParameter.find((error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Get single DynamicParameter
DynamicParameterRoute.route('/read/:id').get((req, res) => {
  DynamicParameter.findOne({ id: req.params.id }, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Update DynamicParameter
DynamicParameterRoute.route('/update/:id').put((req, res, next) => {
  console.log(req.body);
  DynamicParameter.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, (error, data) => {
    if (error) {
      return next(error);
    }
    updateDynamicParameter(req.params.id)
    res.json(data);
    console.log('Data updated successfully');
  });
});

// Delete parameter
DynamicParameterRoute.route('/delete/:id').delete((req, res, next) => {
  DynamicParameter.findByIdAndRemove(req.params.id, (error, data) => {
    console.log(`Removing: ${req.params.id}`);
    if (error) {
      return next(error);
    }
    res.status(200).json({
      msg: data,
    });
  });
});

DynamicParameterRoute.route('/run').post((req, res) => {
  const custom_id = new mongoose.Types.ObjectId().toHexString();
  console.log("running");
  docker.run({
    block: { lang: req.body.lang, script: req.body.script, prescript: '' },
    parameters: [{ key: '', value: '' }],
    shared: [],
    booleans: [],
    multis: [],
  }, custom_id);

  res.json(custom_id);
});

async function updateDynamicParameter(id)
{
  const dynamicData = await DynamicParameter.findById(id).exec()
  console.log("dynamicData",dynamicData)
  const custom_id = new mongoose.Types.ObjectId().toHexString();
  docker.run({
    block: { lang: dynamicData.lang, script: dynamicData.script, prescript: '' },
    parameters: [{ key: '', value: '' }],
    shared: [],
    booleans: [],
    multis: [],
  }, custom_id);

  const worker = new Worker('./engine/watch.js', { 
    workerData: { 
      model: "DockerInstance", 
      id: custom_id, 
      field: "done"
    }
  });
  return worker.once('message', async (message) => {
    if (!message) // success
    {
      const dockerData = await DockerInstance.findById(custom_id).exec()
      console.log(dockerData.output[0].value.replaceAll('[','').replaceAll(']','').replace(/['"]+/g, '').split(','))
      DynamicParameter.findByIdAndUpdate(id, {
        $set: {output:dockerData.output[0].value.replaceAll('[','').replaceAll(']','').replace(/['"]+/g, '').split(',')},
      }).exec()
      return dockerData.output[0].value.replaceAll('[','').replaceAll(']','').replace(/['"]+/g, '').split(',')
    }
  });
}

module.exports = { DynamicParameterRoute, updateDynamicParameter };
