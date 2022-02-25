const uploadFile = require("../middleware/upload");
const fs = require("fs");
const path = require("path")
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

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
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
  const directoryPath = path.join(__dirname, "../resources/static/assets/uploads/")
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
  const directoryPath = path.join(__dirname, "../resources/static/assets/uploads/")
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
  const directoryPath = path.join(__dirname, "../resources/static/assets/uploads/" + req.params.name)
  fs.unlink(directoryPath, (err) => {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }
    res.status(200).send({
      message: "Delete the file successfully: " + fileName,
    });
    //file removed
  })
};

module.exports = {
  upload,
  getListFiles,
  download,
  deleteFile
};