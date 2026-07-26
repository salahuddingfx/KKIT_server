const Assignment = require("./assignment.model");
const Submission = require("../submission/submission.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getAllAssignments = async (query, options) => {
  const filter = {};
  if (query.course) filter.course = query.course;
  if (query.status) filter.status = query.status;
  if (query.module) filter.module = query.module;
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }
  return paginate(Assignment, filter, { ...options, populate: "course" });
};

const getAssignmentById = async (id) => {
  const assignment = await Assignment.findById(id)
    .populate("course", "title slug")
    .populate("createdBy", "name email")
    .populate("assignedTo.user", "name email");
  if (!assignment) throw ApiError.notFound("Assignment not found");
  return assignment;
};

const createAssignment = async (data) => {
  return Assignment.create(data);
};

const updateAssignment = async (id, data) => {
  const assignment = await Assignment.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!assignment) throw ApiError.notFound("Assignment not found");
  return assignment;
};

const deleteAssignment = async (id) => {
  const assignment = await Assignment.findByIdAndDelete(id);
  if (!assignment) throw ApiError.notFound("Assignment not found");
  return assignment;
};

const assignToStudents = async (assignmentId, userIds) => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw ApiError.notFound("Assignment not found");

  const newUsers = userIds
    .filter((uid) => !assignment.assignedTo.some((a) => a.user.toString() === uid))
    .map((uid) => ({ user: uid }));

  assignment.assignedTo.push(...newUsers);
  assignment.assignedToAll = false;
  await assignment.save();
  return assignment;
};

const unassignStudent = async (assignmentId, userId) => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw ApiError.notFound("Assignment not found");

  assignment.assignedTo = assignment.assignedTo.filter((a) => a.user.toString() !== userId);
  await assignment.save();
  return assignment;
};

const getAssignmentStats = async (assignmentId) => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw ApiError.notFound("Assignment not found");

  const stats = await Submission.aggregate([
    { $match: { assignment: assignment._id } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        avgPoints: { $avg: "$grade.points" },
      },
    },
  ]);

  const totalSubmissions = await Submission.countDocuments({ assignment: assignmentId });
  const gradedSubmissions = await Submission.countDocuments({ assignment: assignmentId, status: "graded" });

  return {
    assignment: assignment.title,
    totalSubmissions,
    gradedSubmissions,
    pendingGrading: totalSubmissions - gradedSubmissions,
    statusBreakdown: stats,
  };
};

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
