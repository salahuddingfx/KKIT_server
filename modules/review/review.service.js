const Review = require("./review.model");
const Course = require("../course/course.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getAllReviews = async (query, options) => {
  const filter = {};
  if (query.course) filter.course = query.course;
  if (query.user) filter.user = query.user;
  if (query.status) filter.status = query.status;
  if (query.rating) filter.rating = parseInt(query.rating);
  return paginate(Review, filter, { ...options, populate: "user course" });
};

const getReviewById = async (id) => {
  const review = await Review.findById(id).populate("user", "name avatar").populate("course", "title");
  if (!review) throw ApiError.notFound("Review not found");
  return review;
};

const createReview = async (data) => {
  const existingReview = await Review.findOne({ user: data.user, course: data.course });
  if (existingReview) throw ApiError.conflict("You have already reviewed this course");

  const review = await Review.create(data);

  // Update course rating
  const stats = await Review.aggregate([
    { $match: { course: review.course, status: "approved" } },
    { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Course.findByIdAndUpdate(review.course, {
      "rating.average": Math.round(stats[0].average * 10) / 10,
      "rating.count": stats[0].count,
    });
  }

  return review;
};

const updateReview = async (id, data) => {
  const review = await Review.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!review) throw ApiError.notFound("Review not found");
  return review;
};

const deleteReview = async (id) => {
  const review = await Review.findByIdAndDelete(id);
  if (!review) throw ApiError.notFound("Review not found");
  return review;
};

module.exports = { getAllReviews, getReviewById, createReview, updateReview, deleteReview };
