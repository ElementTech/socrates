const express = require('express');

const app = express();
const instanceRoute = express.Router();
let docker = require('../engine/docker');
const mongoose = require('mongoose');
// Instance model
const Instance = require('../models/Instance');
const Flow = require('../models/Flow');
const Flowviz = require('../models/Flowviz');
const auth = require('../middleware/auth');

instanceRoute.use(auth);
// Add Instance
instanceRoute.route('/create').post((req, res, next) => {
  Instance.create(Object.assign(req.body, { user: req.user._id }), (error, data) => {
    if (error) {
      res.status(400).json(error)
      return next(error)
    } 
      res.json(data)
    
  });
});

// Get All Instances
instanceRoute.route('/').get((req, res, next) => {
  Instance.find().populate({
    path: 'block',
    model: 'Block', 
    }).populate('user').exec((error, data)=> {
    if (error) {
      return next(error);
    } else {
      Flow.find((error, flows) => {
        Flowviz.find((error, flows_viz) => {
          res.json(data.map((instance)=> ({ ...instance.toJSON(), flow_count: flows.filter((flow)=> flow.steps.flat().map((step)=> step.id).includes(instance._id.toString()),
            ).length, flowviz_count: flows_viz.filter((flow)=> flow.nodes.map((node)=> node.data.name).includes(instance.name),
            ).length }),
          ));
        });
      });
    }
  });
});

// Get All Instances
instanceRoute.route('/block/read/:id').get((req, res, next) => {
  Instance.find({ block: req.params.id }).populate('user').sort({ _id: -1 }).exec((error,data)
  => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get single instance
instanceRoute.route('/read/:id').get((req, res, next) => {
  Instance.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } 
      res.json(data)
    
  });
});

function updateFlowVizes(oldname, newname) {
  Flowviz.updateMany({ "nodes.data.name": oldname }, { $set: { 'nodes.$.data.name': newname } }, (error, data) => {
    Flowviz.find({ "nodes.data.name": oldname }, (error, data) => {
      if (data.length != 0) {
        updateFlowVizes(oldname, newname);
      }
    });
  });
}

// Update instance
instanceRoute.route('/update/:id').put((req, res, next) => {
  Instance.findById(req.params.id).exec().then((inst)=> {
    if (inst.name != req.params.name) {
      updateFlowVizes(inst.name, req.body.name);
    }
    Instance.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    }, (error, data) => {
      if (error) {
        res.error(error)
        return next(error);
      } 
        res.json(data)
        console.log('Data updated successfully')
      
    });
  });
});

// Delete instance
instanceRoute.route('/delete/:id').delete((req, res, next) => {
 Instance.findById(req.params.id).exec().then((inst)=> {
    Flow.find().exec(async (error,flows)=> {
      Flowviz.find().exec(async function(error,flows_viz){
      const flowLength = flows.filter(flow=>
        flow.steps.flat().map(step=>step.id).includes(req.params.id.toString())
      ).length
      const flowvizLength = flows_viz.filter(flow=>
        flow.nodes.map(node=>node.data.name).includes(inst.name)
      ).length
    if (error) {
      return next(error);
    } 
      console.log(flowLength,flowvizLength)
      if (flowLength == 0 && flowvizLength == 0){
        Instance.findByIdAndRemove(req.params.id, (error, data) => {
          console.log("Removing: " + req.params.id)
          if (error) {
            res.status(500).json({
              msg: error
            })
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
          msg: "Instance Has Flow Attached"
        })
      }
    
    });
    });
  });

});

instanceRoute.route('/run').post((req, res) => {
  Instance.findById(req.body.id).populate({
    path: 'block',
    model: 'Block', 
    }).exec((error, data)=> {
    if (error) {
      return next(error);
    } else {
        // childProcess.exec('ls -l', { shell: '/bin/bash' },
      // (error, stdout, stderr) => {
      //   res.json({ error, stdout, stderr });
      //   process.exit();
      // });
      const custom_id = new mongoose.Types.ObjectId().toHexString();
      data.parameters = req.body.parameters;
      data.shared = req.body.shared;
      data.booleans = req.body.booleans;
      data.multis = req.body.multis;
      data.dynamic = req.body.dynamic;
      console.log(data);
      docker.run(data, custom_id);
      res.json(custom_id);
    }
  });
});

module.exports = instanceRoute;
