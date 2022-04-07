const fs = require('fs');
const path = require('path');
const uploadFile = require('../middleware/upload');
const { minioClient } = require('../database/minio');

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: 'Please upload a file!' });
    }

    res.status(200).send({
      message: `Uploaded the file successfully: ${req.file.originalname}`,
    });
  } catch (err) {
    console.log(err);

    if (err.code == 'LIMIT_FILE_SIZE') {
      return res.status(500).send({
        message: 'File size cannot be larger than 2MB!',
      });
    }
    try {
      res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });
    } catch (error) {
      res.status(500).send({
        message: `Could not upload the file. ${err}`,
      });
    }
  }
};

const getListFiles = (req, res) => {
  const minioStream = minioClient.listObjects('icons', '', true);
  const artifacts = [];
  minioStream.on('data', (obj) => {
    artifacts.push({ name: obj.name });
  });
  minioStream.on('end', (obj) => {
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
  minioClient.fGetObject('icons', fileName, `/tmp/${fileName}`, (err) => {
    if (err) {
      return console.log(err);
    }
    res.download(`/tmp/${fileName}`, fileName, (err) => {
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
  minioClient.removeObject('icons', fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: 'Unable to scan files!',
      });
    }
    res.status(200).send({
      message: `Delete the file successfully: ${fileName}`,
    });
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
  deleteFile,
};
