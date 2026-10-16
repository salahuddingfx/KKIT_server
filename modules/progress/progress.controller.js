const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const progressService = require("./progress.service");
const ApiError = require("../../utils/apiError");

const markComplete = catchAsync(async (req, res) => {
  const { courseId, lessonId } = req.params;
  const progress = await progressService.markLessonComplete(
    req.user._id,
    courseId,
    lessonId
  );
  ApiResponse.success(res, progress, "Lesson marked as complete");
});

const updateLessonProgress = catchAsync(async (req, res) => {
  const { courseId, lessonId } = req.params;
  const { watchTime, lastPosition } = req.body;
  const progress = await progressService.updateProgress(
    req.user._id,
    courseId,
    lessonId,
    { watchTime, lastPosition }
  );
  ApiResponse.success(res, progress);
});

const getCourseProgress = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const progress = await progressService.getCourseProgress(
    req.user._id,
    courseId
  );
  ApiResponse.success(res, progress);
});

const getUserCoursesProgress = catchAsync(async (req, res) => {
  const progress = await progressService.getUserCoursesProgress(req.user._id);
  ApiResponse.success(res, progress);
});

const deleteLessonProgress = catchAsync(async (req, res) => {
  const { courseId, lessonId } = req.params;
  await progressService.deleteProgress(req.user._id, courseId, lessonId);
  ApiResponse.noContent(res);
});

module.exports = {
  markComplete,
  updateLessonProgress,
  getCourseProgress,
  getUserCoursesProgress,
  deleteLessonProgress,
};
