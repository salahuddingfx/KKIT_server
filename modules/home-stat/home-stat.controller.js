const homeStatService = require("./home-stat.service");
const ApiResponse = require("../../utils/apiResponse");
const catchAsync = require("../../utils/catchAsync");

const getStats = catchAsync(async (req, res) => {
  const stats = await homeStatService.getAll(req.query);
  ApiResponse.success(res, stats, "Stats fetched");
});

const getStatById = catchAsync(async (req, res) => {
  const stat = await homeStatService.getById(req.params.id);
  ApiResponse.success(res, stat, "Stat fetched");
});

const createStat = catchAsync(async (req, res) => {
  const stat = await homeStatService.create(req.body);
  ApiResponse.created(res, stat, "Stat created");
});

const updateStat = catchAsync(async (req, res) => {
  const stat = await homeStatService.update(req.params.id, req.body);
  ApiResponse.success(res, stat, "Stat updated");
});

const deleteStat = catchAsync(async (req, res) => {
  await homeStatService.remove(req.params.id);
  ApiResponse.success(res, null, "Stat deleted");
});

module.exports = { getStats, getStatById, createStat, updateStat, deleteStat };
