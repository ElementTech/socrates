const util = require('util');
const multer = require('multer');
const path = require('path');

const maxSize = 2 * 1024 * 1024;
const multerMinio = require('multer-minio-storage-engine');
const { minioClient } = require('../database/minio');

const uploadFile = multer({
  storage: multerMinio({
    minio: minioClient,
    bucketName: 'icons',
    metaData(req, file, cb) {
      cb(null, { mimetype: file.mimetype });
    },
    objectName(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  fileFilter(req, file, callback) {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'));
    }
    callback(null, true);
  },
  limits: { fileSize: maxSize },
}).single('file');

const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
