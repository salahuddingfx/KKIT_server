const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const newsletterService = require("./newsletter.service");

const getAllSubscribers = catchAsync(async (req, res) => {
  const result = await newsletterService.getAllSubscribers(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const subscribe = catchAsync(async (req, res) => {
  const subscriber = await newsletterService.subscribe(req.body);
  ApiResponse.created(res, subscriber, "Subscribed successfully");
});

const unsubscribe = catchAsync(async (req, res) => {
  await newsletterService.unsubscribe(req.params.id);
  ApiResponse.success(res, null, "Unsubscribed successfully");
});

module.exports = { getAllSubscribers, subscribe, unsubscribe };
