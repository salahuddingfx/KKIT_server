const Subscription = require("./subscription.model");
const Pricing = require("../pricing/pricing.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getActiveSubscription = async (userId) => {
  return Subscription.findOne({
    user: userId,
    status: { $in: ["active", "paused"] },
  }).populate("plan");
};

const createSubscription = async (userId, { planId, paymentMethod = "manual" }) => {
  const plan = await Pricing.findById(planId);
  if (!plan) throw ApiError.notFound("Plan not found");
  if (plan.type !== "subscription") throw ApiError.badRequest("This is not a subscription plan");

  const existing = await getActiveSubscription(userId);
  if (existing) throw ApiError.conflict("You already have an active subscription");

  const startDate = new Date();
  const endDate = new Date();
  if (plan.interval === "monthly") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (plan.interval === "yearly") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  return Subscription.create({
    user: userId,
    plan: planId,
    status: "active",
    startDate,
    endDate,
    nextBillingDate: endDate,
    paymentMethod,
    amount: plan.price,
    currency: plan.currency || "USD",
  });
};

const cancelSubscription = async (subscriptionId, userId) => {
  const subscription = await Subscription.findOne({
    _id: subscriptionId,
    user: userId,
  });

  if (!subscription) throw ApiError.notFound("Subscription not found");
  if (subscription.status === "cancelled") throw ApiError.badRequest("Subscription already cancelled");

  subscription.status = "cancelled";
  subscription.cancelledAt = new Date();
  subscription.autoRenew = false;
  await subscription.save();

  return subscription;
};

const pauseSubscription = async (subscriptionId, userId) => {
  const subscription = await Subscription.findOne({
    _id: subscriptionId,
    user: userId,
    status: "active",
  });

  if (!subscription) throw ApiError.notFound("Active subscription not found");

  subscription.status = "paused";
  subscription.pauseStartDate = new Date();
  await subscription.save();

  return subscription;
};

const resumeSubscription = async (subscriptionId, userId) => {
  const subscription = await Subscription.findOne({
    _id: subscriptionId,
    user: userId,
    status: "paused",
  });

  if (!subscription) throw ApiError.notFound("Paused subscription not found");

  subscription.status = "active";
  subscription.pauseEndDate = new Date();
  await subscription.save();

  return subscription;
};

const getUserSubscriptions = async (userId) => {
  return Subscription.find({ user: userId })
    .populate("plan")
    .sort({ createdAt: -1 });
};

const getAllSubscriptions = async (query, options) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.user) filter.user = query.user;
  return paginate(Subscription, filter, { ...options, populate: "user plan" });
};

module.exports = {
  getActiveSubscription,
  createSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
};
