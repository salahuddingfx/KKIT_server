const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const projectService = require("./project.service");
const { emitEvent } = require("../gamification/gamification.service");

const getMyProjects = catchAsync(async (req, res) => {
  const data = await projectService.getProjectsByUser(req.user._id);
  ApiResponse.success(res, data);
});

const getAllProjects = catchAsync(async (req, res) => {
  const result = await projectService.getAllProjects(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getProjectById = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  const isInstructor = ["super_admin", "admin", "ceo", "md", "finance", "mentor", "trainer"].includes(req.user.role);
  if (!isInstructor && project.user._id.toString() !== req.user._id.toString()) {
    throw new (require("../../utils/apiError"))(403, "Not authorized to view this project");
  }
  ApiResponse.success(res, project);
});

const createProject = catchAsync(async (req, res) => {
  const data = await projectService.createProject(req.user._id, req.body);
  ApiResponse.success(res, data, "Project created");
});

const updateProject = catchAsync(async (req, res) => {
  const data = await projectService.updateProject(req.params.id, req.body);
  ApiResponse.success(res, data, "Project updated");
});

const deleteProject = catchAsync(async (req, res) => {
  await projectService.deleteProject(req.params.id);
  ApiResponse.noContent(res);
});

const submitProject = catchAsync(async (req, res) => {
  const data = await projectService.submitProject(req.user._id, req.params.id, req.body);
  emitEvent("project_submit", { userId: req.user._id.toString() });
  ApiResponse.success(res, data, "Project submitted for review");
});

const completeMilestone = catchAsync(async (req, res) => {
  const data = await projectService.completeMilestone(req.user._id, req.params.id, parseInt(req.params.milestoneIndex));
  emitEvent("milestone_complete", { userId: req.user._id.toString() });
  ApiResponse.success(res, data, "Milestone completed");
});

const approveProject = catchAsync(async (req, res) => {
  const data = await projectService.approveProject(req.params.id, req.body.grade, req.body.feedback);
  emitEvent("project_approve", { userId: data.user.toString() });
  ApiResponse.success(res, data, "Project approved");
});

const requestRevision = catchAsync(async (req, res) => {
  const data = await projectService.requestRevision(req.params.id, req.body.feedback);
  ApiResponse.success(res, data, "Revision requested");
});

module.exports = {
  getMyProjects,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  submitProject,
  completeMilestone,
  approveProject,
  requestRevision,
};
