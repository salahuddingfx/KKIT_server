const express = require("express");
const router = express.Router();
const smsController = require("./sms.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

// All SMS admin routes require authentication and admin/super_admin role
router.use(protect);
router.use(authorize("super_admin", "admin", "ceo", "md"));

router.get("/status", smsController.getSmsConfigStatus);
router.post("/send-test", smsController.sendTestSMS);

module.exports = router;
