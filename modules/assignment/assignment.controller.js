const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const assignmentService = require("./assignment.service");

const getAllAssignments = catchAsync(async (req, res) => {
  const result = await assignmentService.getAllAssignments(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getAssignmentById = catchAsync(async (req, res) => {
  const assignment = await assignmentService.getAssignmentById(req.params.id);
  ApiResponse.success(res, assignment);
});

const createAssignment = catchAsync(async (req, res) => {
  req.body.createdBy = req.user._id;
  const assignment = await assignmentService.createAssignment(req.body);
  ApiResponse.created(res, assignment);
});

const updateAssignment = catchAsync(async (req, res) => {
  const assignment = await assignmentService.updateAssignment(req.params.id, req.body);
  ApiResponse.success(res, assignment, "Assignment updated");
});

const deleteAssignment = catchAsync(async (req, res) => {
  await assignmentService.deleteAssignment(req.params.id);
  ApiResponse.noContent(res);
});

const assignToStudents = catchAsync(async (req, res) => {
  const assignment = await assignmentService.assignToStudents(req.params.id, req.body.userIds);
  ApiResponse.success(res, assignment, "Students assigned");
});

const unassignStudent = catchAsync(async (req, res) => {
  const assignment = await assignmentService.unassignStudent(req.params.id, req.params.userId);
  ApiResponse.success(res, assignment, "Student unassigned");
});

const getAssignmentStats = catchAsync(async (req, res) => {
  const stats = await assignmentService.getAssignmentStats(req.params.id);
  ApiResponse.success(res, stats);
});

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  assignToStudents,
  unassignStudent,
  getAssignmentStats,
};
