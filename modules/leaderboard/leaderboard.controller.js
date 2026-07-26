const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const leaderboardService = require("./leaderboard.service");

const getLeaderboard = catchAsync(async (req, res) => {
  const data = await leaderboardService.getLeaderboard({ limit: parseInt(req.query.limit) || 50 });
  ApiResponse.success(res, data);
});

const getMyStats = catchAsync(async (req, res) => {
  const data = await leaderboardService.getMyStats(req.user._id);
  ApiResponse.success(res, data);
});

module.exports = { getLeaderboard, getMyStats };
