const express = require("express");
const router = express.Router();
const revenueAnalyticsController = require("./revenue-analytics.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.use(protect);
router.use(authorize("super_admin", "admin", "ceo", "md", "finance"));

router.get("/summary", revenueAnalyticsController.getRevenueSummary);
router.get("/by-month", revenueAnalyticsController.getRevenueByMonth);
router.get("/by-course", revenueAnalyticsController.getRevenueByCourse);
router.get("/by-category", revenueAnalyticsController.getRevenueByCategory);
router.get("/by-method", revenueAnalyticsController.getRevenueByMethod);
router.get("/dashboard-stats", revenueAnalyticsController.getDashboardStats);
router.get("/funnel", revenueAnalyticsController.getConversionFunnel);
router.get("/top-courses", revenueAnalyticsController.getTopCourses);
router.get("/growth", revenueAnalyticsController.getRevenueGrowth);

module.exports = router;
