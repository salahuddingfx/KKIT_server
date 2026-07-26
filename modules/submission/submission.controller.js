const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const ApiError = require("../../utils/apiError");
const submissionService = require("./submission.service");
const { emitEvent } = require("../gamification/gamification.service");

const getAllSubmissions = catchAsync(async (req, res) => {
  const result = await submissionService.getAllSubmissions(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getSubmissionById = catchAsync(async (req, res) => {
  const submission = await submissionService.getSubmissionById(req.params.id);
  const isAdmin = ["super_admin", "admin", "ceo", "md", "finance", "mentor", "trainer"].includes(req.user.role);
  if (!isAdmin && submission.student._id.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden("Not authorized to view this submission");
  }
  ApiResponse.success(res, submission);
});

const getMySubmissions = catchAsync(async (req, res) => {
  const result = await submissionService.getMySubmissions(req.user._id, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getMyGrades = catchAsync(async (req, res) => {
  const grades = await submissionService.getMyGrades(req.user._id);
  ApiResponse.success(res, grades);
});

const submitAssignment = catchAsync(async (req, res) => {
  req.body.student = req.user._id;
  req.body.course = req.body.courseId;
  delete req.body.courseId;
  const submission = await submissionService.submitAssignment(req.body);
  emitEvent("assignment_submit", { userId: req.user._id.toString() });
  ApiResponse.created(res, submission, "Assignment submitted");
});

const gradeSubmission = catchAsync(async (req, res) => {
  const submission = await submissionService.gradeSubmission(req.params.id, req.body, req.user._id);
  ApiResponse.success(res, submission, "Submission graded");
});

const returnSubmission = catchAsync(async (req, res) => {
  const submission = await submissionService.returnSubmission(req.params.id, req.body.returnNote, req.user._id);
  ApiResponse.success(res, submission, "Submission returned");
});

const deleteSubmission = catchAsync(async (req, res) => {
  await submissionService.deleteSubmission(req.params.id);
  ApiResponse.noContent(res);
});

const completeMilestone = catchAsync(async (req, res) => {
  const submission = await submissionService.completeMilestone(
    req.params.id,
    parseInt(req.params.milestoneIndex),
    req.user._id
  );
  emitEvent("milestone_complete", { userId: req.user._id.toString() });
  ApiResponse.success(res, submission, "Milestone completed");
});

module.exports = {
  getAllSubmissions,
  getSubmissionById,
  getMySubmissions,
  getMyGrades,
  submitAssignment,
  gradeSubmission,
  returnSubmission,
  deleteSubmission,
  completeMilestone,
};
