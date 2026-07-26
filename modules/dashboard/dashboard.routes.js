const express = require("express");
const router = express.Router();
const dashboardController = require("./dashboard.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.use(protect);
router.use(authorize("super_admin", "admin", "ceo", "md"));

router.get("/stats", dashboardController.getStats);
router.get("/enrollments", dashboardController.getEnrollmentChart);
router.get("/revenue", dashboardController.getRevenueChart);
router.get("/recent", dashboardController.getRecentActivity);

module.exports = router;
