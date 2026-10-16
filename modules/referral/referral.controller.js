const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const referralService = require("./referral.service");

const generateCode = catchAsync(async (req, res) => {
  const code = await referralService.generateReferralCode(req.user._id);
  ApiResponse.success(res, { code });
});

const getStats = catchAsync(async (req, res) => {
  const stats = await referralService.getReferralStats(req.user._id);
  ApiResponse.success(res, stats);
});

const getHistory = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await referralService.getReferralHistory(req.user._id, {
    page: parseInt(page),
    limit: parseInt(limit),
  });
  ApiResponse.success(res, result);
});

module.exports = {
  generateCode,
  getStats,
  getHistory,
};
