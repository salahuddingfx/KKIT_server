const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const revenueAnalyticsService = require("./revenue-analytics.service");

const getRevenueSummary = catchAsync(async (req, res) => {
  const data = await revenueAnalyticsService.getRevenueSummary(req.query.period);
  ApiResponse.success(res, data);
});

const getRevenueByMonth = catchAsync(async (req, res) => {
  const months = parseInt(req.query.months, 10) || 12;
  const data = await revenueAnalyticsService.getRevenueByMonth(months);
  ApiResponse.success(res, data);
});

const getRevenueByCourse = catchAsync(async (req, res) => {
  const data = await revenueAnalyticsService.getRevenueByCourse();
  ApiResponse.success(res, data);
});

const getRevenueByCategory = catchAsync(async (req, res) => {
  const data = await revenueAnalyticsService.getRevenueByCategory();
  ApiResponse.success(res, data);
});

const getRevenueByMethod = catchAsync(async (req, res) => {
  const data = await revenueAnalyticsService.getRevenueByMethod();
  ApiResponse.success(res, data);
});

const getDashboardStats = catchAsync(async (req, res) => {
  const data = await revenueAnalyticsService.getDashboardStats();
  ApiResponse.success(res, data);
});

const getConversionFunnel = catchAsync(async (req, res) => {
  const data = await revenueAnalyticsService.getConversionFunnel();
  ApiResponse.success(res, data);
});

const getTopCourses = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  const data = await revenueAnalyticsService.getTopCourses(limit);
  ApiResponse.success(res, data);
});

const getRevenueGrowth = catchAsync(async (req, res) => {
  const data = await revenueAnalyticsService.getRevenueGrowth();
  ApiResponse.success(res, data);
});

module.exports = {
  getRevenueSummary,
  getRevenueByMonth,
  getRevenueByCourse,
  getRevenueByCategory,
  getRevenueByMethod,
  getDashboardStats,
  getConversionFunnel,
  getTopCourses,
  getRevenueGrowth,
};
