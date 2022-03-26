const { parentPort, workerData } = require('worker_threads');
const Docker = require('dockerode');
const Settings = require('../models/Settings');

const docker = new Docker();
const { images } = workerData;
const { settings } = workerData;
const { id } = workerData;
const { auth } = workerData;
dbConfig = require('../database/db');
mongoose = require('mongoose'),
mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.db, {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 20000,
  socketTimeoutMS: 45000,
}).then(
  () => {
    docker.listImages((err, result) => {
      currentImages = result.map((item) => (item.RepoTags ? item.RepoTags[0] : ''));
      images.forEach((image) => {
        if (!currentImages.includes(image)) {
          console.log(`Pulling ${image}`);
          docker.pull(image, { authconfig: auth }, (err, stream) => {
            if (err) {
              Settings.findByIdAndUpdate(
                id,
                {
                  $pull: {
                    langs: { image: image.split(':')[0], tag: image.split(':')[1] },
                  },
                },
                (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(result);
                  }
                },
              );
            }
          });
        } else {
          console.log(`${image} already exists`);
        }
      });
    });
  },
  (error) => {
    console.log(`Database could not connected: ${error}`);
    process.exit(error);
  },
);

const deleteByPath = (object, path) => {
  let currentObject = object;
  const parts = path.split('.');
  const last = parts.pop();
  for (const part of parts) {
    currentObject = currentObject[part];
    if (!currentObject) {
      return;
    }
  }
  delete currentObject[last];
};

parentPort.postMessage('Syncronously Pulling');
