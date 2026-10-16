const crypto = require("crypto");
const Referral = require("./referral.model");
const User = require("../user/user.model");
const ApiError = require("../../utils/apiError");

const generateReferralCode = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");

  const existing = await Referral.findOne({ referrer: userId });
  if (existing) return existing.referralCode;

  const code = `KKIT-${user.name.substring(0, 3).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  await Referral.create({
    referrer: userId,
    referralCode: code,
  });

  return code;
};

const getReferralStats = async (userId) => {
  const totalReferrals = await Referral.countDocuments({ referrer: userId });
  const completedReferrals = await Referral.countDocuments({
    referrer: userId,
    status: { $in: ["completed", "rewarded"] },
  });
  const totalEarnings = await Referral.aggregate([
    { $match: { referrer: userId, status: "rewarded" } },
    { $group: { _id: null, total: { $sum: "$commission" } } },
  ]);

  return {
    totalReferrals,
    completedReferrals,
    pendingReferrals: totalReferrals - completedReferrals,
    totalEarnings: totalEarnings[0]?.total || 0,
  };
};

const getReferralHistory = async (userId, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const [referrals, total] = await Promise.all([
    Referral.find({ referrer: userId })
      .populate("referredUser", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Referral.countDocuments({ referrer: userId }),
  ]);

  return {
    referrals,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const applyReferral = async (referralCode, newUserId, paymentAmount) => {
  const referral = await Referral.findOne({ referralCode });
  if (!referral) throw ApiError.notFound("Invalid referral code");
  if (referral.referrer.toString() === newUserId.toString()) {
    throw ApiError.badRequest("Cannot refer yourself");
  }

  referral.referredUser = newUserId;
  referral.status = "completed";
  referral.purchaseAmount = paymentAmount;
  referral.commission = (paymentAmount * referral.commissionRate) / 100;
  await referral.save();

  return referral;
};

module.exports = {
  generateReferralCode,
  getReferralStats,
  getReferralHistory,
  applyReferral,
};
