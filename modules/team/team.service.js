const Team = require("./team.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getAllTeam = async (query, options) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.department) filter.department = query.department;
  return paginate(Team, filter, options);
};

const getTeamBySlug = async (slug) => {
  const member = await Team.findOne({ slug });
  if (!member) throw ApiError.notFound("Team member not found");
  return member;
};

const createTeam = async (data) => {
  return Team.create(data);
};

const updateTeam = async (id, data) => {
  const member = await Team.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!member) throw ApiError.notFound("Team member not found");
  return member;
};

const deleteTeam = async (id) => {
  const member = await Team.findByIdAndDelete(id);
  if (!member) throw ApiError.notFound("Team member not found");
  return member;
};

module.exports = { getAllTeam, getTeamBySlug, createTeam, updateTeam, deleteTeam };
