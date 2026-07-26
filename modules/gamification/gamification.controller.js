const gamificationService = require("./gamification.service");
const catchAsync = require("../../utils/catchAsync");

const getMyGamification = catchAsync(async (req, res) => {
  const data = await gamificationService.getMyGamification(req.user._id);
  res.status(200).json({ success: true, data });
});

const getAllBadges = catchAsync(async (req, res) => {
  const data = await gamificationService.getAllBadges();
  res.status(200).json({ success: true, data });
});

const getLeaderboard = catchAsync(async (req, res) => {
  const data = await gamificationService.getLeaderboard({ limit: parseInt(req.query.limit) || 50 });
  res.status(200).json({ success: true, data });
});

module.exports = { getMyGamification, getAllBadges, getLeaderboard };
