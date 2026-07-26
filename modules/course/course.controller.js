const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const courseService = require("./course.service");

const getAllCourses = catchAsync(async (req, res) => {
  const result = await courseService.getAllCourses(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getCourseById = catchAsync(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  ApiResponse.success(res, course);
});

const getCourseBySlug = catchAsync(async (req, res) => {
  const course = await courseService.getCourseBySlug(req.params.slug);
  ApiResponse.success(res, course);
});

const createCourse = catchAsync(async (req, res) => {
  req.body.instructor = req.user._id;
  const course = await courseService.createCourse(req.body);
  ApiResponse.created(res, course);
});

const updateCourse = catchAsync(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  ApiResponse.success(res, course, "Course updated");
});

const deleteCourse = catchAsync(async (req, res) => {
  await courseService.deleteCourse(req.params.id);
  ApiResponse.noContent(res);
});

const enrollInCourse = catchAsync(async (req, res) => {
  const course = await courseService.enrollInCourse(req.params.id, req.user._id);
  ApiResponse.success(res, course, "Enrolled successfully");
});

const assignMentor = catchAsync(async (req, res) => {
  const course = await courseService.assignMentor(req.params.id, req.body.userId);
  ApiResponse.success(res, course, "Mentor assigned");
});

const unassignMentor = catchAsync(async (req, res) => {
  const course = await courseService.unassignMentor(req.params.id, req.params.userId);
  ApiResponse.success(res, course, "Mentor unassigned");
});

const assignTrainer = catchAsync(async (req, res) => {
  const course = await courseService.assignTrainer(req.params.id, req.body.userId);
  ApiResponse.success(res, course, "Trainer assigned");
});

const unassignTrainer = catchAsync(async (req, res) => {
  const course = await courseService.unassignTrainer(req.params.id, req.params.userId);
  ApiResponse.success(res, course, "Trainer unassigned");
});

const getCoursesByUser = catchAsync(async (req, res) => {
  const courses = await courseService.getCoursesByUser(req.params.userId);
  ApiResponse.success(res, courses);
});

const requestModuleDownload = catchAsync(async (req, res) => {
  const result = await courseService.requestModuleDownload(
    req.params.id,
    req.params.moduleId,
    req.body
  );
  ApiResponse.success(res, result, "Module PDF will be sent to your email");
});

const requestCourseOutline = catchAsync(async (req, res) => {
  const result = await courseService.requestCourseOutline(req.params.id, req.body);
  ApiResponse.success(res, result, "Course outline has been sent to your email");
});

module.exports = { getAllCourses, getCourseById, getCourseBySlug, createCourse, updateCourse, deleteCourse, enrollInCourse, assignMentor, unassignMentor, assignTrainer, unassignTrainer, getCoursesByUser, requestModuleDownload, requestCourseOutline };
