const Project = require("./project.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getProjectsByUser = async (userId) => {
  return Project.find({ user: userId }).sort("-createdAt").populate("course", "title");
};

const getAllProjects = async (query, options) => {
  const filter = {};
  if (query.user) filter.user = query.user;
  if (query.status) filter.status = query.status;
  if (query.course) filter.course = query.course;
  return paginate(Project, filter, {
    ...options,
    populate: "user course",
  });
};

const getProjectById = async (id) => {
  const project = await Project.findById(id)
    .populate("user", "name email avatar")
    .populate("course", "title slug");
  if (!project) throw ApiError.notFound("Project not found");
  return project;
};

const createProject = async (userId, data) => {
  const allowed = {};
  const fields = ["title", "description", "course", "courseName", "deadline", "allowLateSubmission", "latePenaltyPerDay", "milestones"];
  for (const f of fields) {
    if (data[f] !== undefined) allowed[f] = data[f];
  }
  return Project.create({ ...allowed, user: userId, status: "not_submitted" });
};

const updateProject = async (id, data) => {
  const allowed = {};
  const fields = ["title", "description", "course", "courseName", "deadline", "allowLateSubmission", "latePenaltyPerDay", "milestones", "repoUrl", "liveUrl"];
  for (const f of fields) {
    if (data[f] !== undefined) allowed[f] = data[f];
  }
  const project = await Project.findByIdAndUpdate(id, { $set: allowed }, { new: true, runValidators: true });
  if (!project) throw ApiError.notFound("Project not found");
  return project;
};

const deleteProject = async (id) => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) throw ApiError.notFound("Project not found");
  return project;
};

const submitProject = async (userId, projectId, data) => {
  const project = await Project.findOne({ _id: projectId, user: userId });
  if (!project) throw ApiError.notFound("Project not found");
  project.repoUrl = data.repoUrl || project.repoUrl;
  project.liveUrl = data.liveUrl || project.liveUrl;
  project.status = "pending_review";
  project.submittedAt = new Date();
  await project.save();
  return project;
};

const completeMilestone = async (userId, projectId, milestoneIndex) => {
  const project = await Project.findOne({ _id: projectId, user: userId });
  if (!project) throw ApiError.notFound("Project not found");
  if (!project.milestones || !project.milestones[milestoneIndex]) {
    throw ApiError.notFound("Milestone not found");
  }
  const milestone = project.milestones[milestoneIndex];
  if (milestone.completed) {
    throw ApiError.badRequest("Milestone already completed");
  }
  milestone.completed = true;
  milestone.completedAt = new Date();
  if (project.status === "not_submitted") {
    project.status = "in_progress";
  }
  await project.save();
  return project;
};

const approveProject = async (projectId, grade, feedback) => {
  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound("Project not found");
  project.status = "approved";
  project.grade = grade || "A";
  project.feedback = feedback || "";
  project.reviewedAt = new Date();
  await project.save();
  return project;
};

const requestRevision = async (projectId, feedback) => {
  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound("Project not found");
  project.status = "revision_requested";
  project.feedback = feedback || "";
  project.reviewedAt = new Date();
  await project.save();
  return project;
};

module.exports = {
  getProjectsByUser,
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
