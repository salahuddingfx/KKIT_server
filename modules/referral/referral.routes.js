const express = require("express");
const router = express.Router();
const referralController = require("./referral.controller");
const { protect } = require("../../middleware/auth");

router.use(protect);

router.get("/code", referralController.generateCode);
router.get("/stats", referralController.getStats);
router.get("/history", referralController.getHistory);

module.exports = router;
