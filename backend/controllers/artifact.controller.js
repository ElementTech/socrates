const uploadFile = require("../middleware/upload_artifact");
const fs = require("fs");
const path = require("path")
const DockerInstance = require("../models/DockerInstance")
const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

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
  console.log(req)
  const instanceID = req.params.instance;
  const dockerID = req.params.docker;
  const directoryPath = path.join(__dirname, "../resources/artifacts/" + instanceID + "/" + dockerID)
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const instanceID = req.params.instance;
  const dockerID = req.params.docker;
  const directoryPath = path.join(__dirname, "../resources/artifacts/" + instanceID + "/" + dockerID + "/")
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

const deleteFile = (req, res) => {
  const fileName = req.params.name;
  const instanceID = req.params.instance;
  const dockerID = req.params.docker;
  const directoryPath = path.join(__dirname, "../resources/artifacts/" + instanceID + "/" + dockerID + "/" + fileName)
  fs.unlink(directoryPath, (err) => {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    DockerInstance.findByIdAndUpdate(dockerID, {
      $pull:  { artifacts: fileName }
    }, (error, data) => {
      if (error) {
        console.log(error)
        res.status(500).send({
          message: "Unable to update instance run",
        });
      } else {
        res.status(200).send({
          message: "Delete the file successfully: " + fileName,
        });
      }
    })

    
    //file removed
  })
};

module.exports = {
  upload,
  getListFiles,
  download,
  deleteFile
};