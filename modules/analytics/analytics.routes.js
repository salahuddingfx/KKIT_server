const express = require("express");
const router = express.Router();
const analyticsController = require("./analytics.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.use(protect);
router.use(authorize("super_admin", "admin", "ceo", "md", "finance"));

router.get("/dashboard", analyticsController.getDashboard);
router.get("/users", analyticsController.getUserMetrics);
router.get("/courses", analyticsController.getCourseMetrics);
router.get("/revenue", analyticsController.getRevenueMetrics);
router.get("/engagement", analyticsController.getEngagementMetrics);

module.exports = router;
