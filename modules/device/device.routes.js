const express = require("express");
const router = express.Router();
const deviceController = require("./device.controller");
const { protect } = require("../../middleware/auth");

router.use(protect);
router.get("/", deviceController.getActiveDevices);
router.delete("/:deviceId", deviceController.removeDevice);
router.delete("/", deviceController.removeAllDevices);

module.exports = router;
