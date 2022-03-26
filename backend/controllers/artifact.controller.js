const fs = require('fs');
const path = require('path');
const DockerInstance = require('../models/DockerInstance');
const { minioClient } = require('../database/minio');

const getListFiles = (req, res) => {
  const instanceID = req.params.instance;
  const dockerID = req.params.docker;

  const minioStream = minioClient.listObjects('artifacts', '', true);
  const artifacts = [];
  minioStream.on('data', (obj) => {
    obj = obj.name.split('/');
    if ((obj[0] == instanceID) && (obj[1] == dockerID)) {
      artifacts.push({ name: obj[2] });
    }
  });
  minioStream.on('end', (obj) => {
    console.log(artifacts);
    res.status(200).send(artifacts);
  });
  minioStream.on('error', (err) => {
    res.status(500).send({
      message: 'Unable to scan files!',
    });
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const instanceID = req.params.instance;
  const dockerID = req.params.docker;
  minioClient.fGetObject('artifacts', `${instanceID}/${dockerID}/${fileName}`, `/tmp/${instanceID}/${dockerID}/${fileName}`, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('success');
    res.download(`/tmp/${instanceID}/${dockerID}/${fileName}`, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: `Could not download the file. ${err}`,
        });
      }
    });
  });
};

const deleteFile = (req, res) => {
  const fileName = req.params.name;
  const instanceID = req.params.instance;
  const dockerID = req.params.docker;

  minioClient.removeObject('artifacts', `${instanceID}/${dockerID}/${fileName}`, (err) => {
    if (err) {
      res.status(500).send({
        message: 'Unable to remove file!',
      });
    }
    DockerInstance.findByIdAndUpdate(dockerID, {
      $pull: { artifacts: fileName },
    }, (error, data) => {
      if (error) {
        console.log(error);
        res.status(500).send({
          message: 'Unable to update instance run',
        });
      } else {
        res.status(200).send({
          message: `Delete the file successfully: ${fileName}`,
        });
      }
    });
  });
};

module.exports = {
  getListFiles,
  download,
  deleteFile,
};
