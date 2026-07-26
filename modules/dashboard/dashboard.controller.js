const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const dashboardService = require("./dashboard.service");

const getStats = catchAsync(async (req, res) => {
  const stats = await dashboardService.getStats();
  ApiResponse.success(res, stats);
});

const getEnrollmentChart = catchAsync(async (req, res) => {
  const chart = await dashboardService.getEnrollmentChart();
  ApiResponse.success(res, chart);
});

const getRevenueChart = catchAsync(async (req, res) => {
  const chart = await dashboardService.getRevenueChart();
  ApiResponse.success(res, chart);
});

const getRecentActivity = catchAsync(async (req, res) => {
  const activity = await dashboardService.getRecentActivity();
  ApiResponse.success(res, activity);
});

module.exports = { getStats, getEnrollmentChart, getRevenueChart, getRecentActivity };
