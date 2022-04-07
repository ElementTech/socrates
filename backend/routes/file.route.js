const express = require('express');

const app = express();
const FileRoute = express.Router();

// File model
const File = require('../models/FileElement');
const auth = require('../middleware/auth');

FileRoute.use(auth);
// Add File
FileRoute.route('/create').post((req, res, next) => {


    /*	#swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/FileElement"
                    }  
                }
            }
    } */

  File.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Get All Files
FileRoute.route('/').get(async (req, res,next) => {
  File.find(async (error, data) => {
    if (error) {
      return next(error);
    }

    data = await Promise.all(data.map(async (file)=>{
      if (!file.isFolder)
      {
        const result = await require('../models/'+file.type.replace(/^./, file.type[0].toUpperCase())).findById(file.fileid).exec()
        const lastRuns = ({
          "instance": await require('../models/DockerInstance').find({"instance":file.fileid,done:true}).sort('-updatedAt').limit(8).exec(),
          "flow": await require('../models/FlowInstance').find({"flow":file.fileid,done:true}).sort('-updatedAt').limit(8).exec(),
          "flowviz": await require('../models/FlowvizInstance').find({"flow":file.fileid,done:true}).sort('-updatedAt').limit(8).exec()
        })[file.type] ?? []

        return {...file.toObject(),"data":result.toObject(),"lastruns_fail":lastRuns.map(run=>(run.error)).reverse(),"lastruns_success":lastRuns.map(run=>(!run.error)).reverse()}
      }
      else
      {
        return file
      }
    }));
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
