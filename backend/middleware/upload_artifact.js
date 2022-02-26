const util = require("util");
const multer = require("multer");
const path = require("path")
// const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const instanceID = req.params.instance;
    const dockerID = req.params.docker;
    const directoryPath = path.join(__dirname, "../resources/artifacts/" + instanceID + "/" + dockerID)
    cb(null, directoryPath);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;