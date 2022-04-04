const { parentPort, workerData } = require('worker_threads');
const theModel = require('../models/'+workerData.model)
console.log("theModel",theModel)
let mongoose = require('mongoose');
dbConfig = require('../database/db');
mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.db, {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,  
  connectTimeoutMS: 20000,
  socketTimeoutMS: 45000,
}).then(
  () => {
    console.log('Database sucessfully connected');
    theModel.watch().on('change', (data) => {

      if ('updateDescription' in data) {
        if ('updatedFields' in data.updateDescription) 
        {
          if ((workerData.field in data.updateDescription.updatedFields) && (data.documentKey._id.toString() == workerData.id)) 
          {
            parentPort.postMessage(data.updateDescription.updatedFields["error"])
          }
        }
      }
    });
  },
  (error) => {
    console.log(`Database could not connected: ${error}`);
    process.exit(error);
  },
);
