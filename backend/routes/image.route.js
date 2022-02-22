const express = require("express");
const router = express.Router();
const controller = require("../controllers/file.controller");
const auth = require("../middleware/auth");
router.use(auth)
router.post("/upload", controller.upload);
router.get("/files", controller.getListFiles);
router.get("/files/:name", controller.download);
router.delete("/files/delete/:name", controller.deleteFile);

module.exports = router;