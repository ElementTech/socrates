const util = require("util");
const multer = require("multer");
const path = require("path")
const maxSize = 2 * 1024 * 1024;
const multerMinio = require('multer-minio-storage-engine');
var minioClient = require('../database/minio').minioClient

let uploadFile = multer({
  storage: multerMinio({
    minio: minioClient,
    bucketName: 'icons',
    metaData: function (req, file, cb) {
      cb(null, {mimetype: file.mimetype});
    },
    objectName: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
    },
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;