const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const analyticsService = require("./analytics.service");

const getDashboard = catchAsync(async (req, res) => {
  const stats = await analyticsService.getDashboardStats();
  ApiResponse.success(res, stats);
});

const getUserMetrics = catchAsync(async (req, res) => {
  const { period } = req.query;
  const metrics = await analyticsService.getUserMetrics({ period });
  ApiResponse.success(res, metrics);
});

const getCourseMetrics = catchAsync(async (req, res) => {
  const metrics = await analyticsService.getCourseMetrics();
  ApiResponse.success(res, metrics);
});

const getRevenueMetrics = catchAsync(async (req, res) => {
  const { period } = req.query;
  const metrics = await analyticsService.getRevenueMetrics({ period });
  ApiResponse.success(res, metrics);
});

const getEngagementMetrics = catchAsync(async (req, res) => {
  const metrics = await analyticsService.getEngagementMetrics();
  ApiResponse.success(res, metrics);
});

module.exports = {
  getDashboard,
  getUserMetrics,
  getCourseMetrics,
  getRevenueMetrics,
  getEngagementMetrics,
};
