const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const teamService = require("./team.service");

const getAllTeam = catchAsync(async (req, res) => {
  const result = await teamService.getAllTeam(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getTeamBySlug = catchAsync(async (req, res) => {
  const member = await teamService.getTeamBySlug(req.params.slug);
  ApiResponse.success(res, member);
});

const createTeam = catchAsync(async (req, res) => {
  const member = await teamService.createTeam(req.body);
  ApiResponse.created(res, member);
});

const updateTeam = catchAsync(async (req, res) => {
  const member = await teamService.updateTeam(req.params.id, req.body);
  ApiResponse.success(res, member, "Team member updated");
});

const deleteTeam = catchAsync(async (req, res) => {
  await teamService.deleteTeam(req.params.id);
  ApiResponse.noContent(res);
});

module.exports = { getAllTeam, getTeamBySlug, createTeam, updateTeam, deleteTeam };
