const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const subscriptionService = require("./subscription.service");

const getMySubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.getActiveSubscription(req.user._id);
  ApiResponse.success(res, subscription);
});

const createSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.createSubscription(req.user._id, req.body);
  ApiResponse.created(res, subscription, "Subscription created successfully");
});

const cancelSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.cancelSubscription(req.params.id, req.user._id);
  ApiResponse.success(res, subscription, "Subscription cancelled");
});

const pauseSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.pauseSubscription(req.params.id, req.user._id);
  ApiResponse.success(res, subscription, "Subscription paused");
});

const resumeSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.resumeSubscription(req.params.id, req.user._id);
  ApiResponse.success(res, subscription, "Subscription resumed");
});

const getUserSubscriptions = catchAsync(async (req, res) => {
  const subscriptions = await subscriptionService.getUserSubscriptions(req.user._id);
  ApiResponse.success(res, subscriptions);
});

const getAllSubscriptions = catchAsync(async (req, res) => {
  const result = await subscriptionService.getAllSubscriptions(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

module.exports = {
  getMySubscription,
  createSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
};
