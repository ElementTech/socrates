const express = require('express');

const router = express.Router();
const controller = require('../controllers/artifact.controller');
const auth = require('../middleware/auth');

router.use(auth);
// router.post("/upload", controller.upload);
router.get('/files/:instance/:docker', controller.getListFiles);
router.get('/files/:instance/:docker/:name', controller.download);
router.delete('/files/delete/:instance/:docker/:name', controller.deleteFile);

module.exports = router;
