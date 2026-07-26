const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const ApiError = require("../../utils/apiError");
const enrollmentService = require("./enrollment.service");

const getAllEnrollments = catchAsync(async (req, res) => {
  const query = { ...req.query };
  if (req.user.role === "user") {
    query.user = req.user._id;
  }
  const result = await enrollmentService.getAllEnrollments(query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getEnrollmentById = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.getEnrollmentById(req.params.id);
  const isAdmin = ["super_admin", "admin", "ceo", "md", "finance", "mentor", "trainer"].includes(req.user.role);
  if (!isAdmin && enrollment.user._id.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden("Not authorized to view this enrollment");
  }
  ApiResponse.success(res, enrollment);
});

const updateEnrollmentStatus = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.updateEnrollmentStatus(req.params.id, req.body.status);
  ApiResponse.success(res, enrollment, "Status updated");
});

const markComplete = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.markComplete(req.params.id);
  ApiResponse.success(res, enrollment, "Enrollment marked complete");
});

const toggleLessonComplete = catchAsync(async (req, res) => {
  const result = await enrollmentService.toggleLessonComplete(req.params.id, req.body.lessonId, req.user._id);
  ApiResponse.success(res, result, result.completed ? "Lesson marked complete" : "Lesson marked incomplete");
});

const getRecentPublicEnrollments = catchAsync(async (req, res) => {
  const data = await enrollmentService.getRecentPublicEnrollments(parseInt(req.query.limit) || 8);
  ApiResponse.success(res, data, "Recent enrollments fetched successfully");
});

module.exports = {
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollmentStatus,
  markComplete,
  toggleLessonComplete,
  getRecentPublicEnrollments,
};
