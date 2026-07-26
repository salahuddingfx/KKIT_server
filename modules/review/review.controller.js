const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const reviewService = require("./review.service");
const { emitEvent } = require("../gamification/gamification.service");

const getAllReviews = catchAsync(async (req, res) => {
  const result = await reviewService.getAllReviews(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getReviewById = catchAsync(async (req, res) => {
  const review = await reviewService.getReviewById(req.params.id);
  ApiResponse.success(res, review);
});

const createReview = catchAsync(async (req, res) => {
  req.body.user = req.user._id;
  const review = await reviewService.createReview(req.body);
  emitEvent("review_write", { userId: req.user._id.toString() });
  ApiResponse.created(res, review);
});

const updateReview = catchAsync(async (req, res) => {
  const review = await reviewService.updateReview(req.params.id, req.body);
  ApiResponse.success(res, review, "Review updated");
});

const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReview(req.params.id);
  ApiResponse.noContent(res);
});

module.exports = { getAllReviews, getReviewById, createReview, updateReview, deleteReview };
