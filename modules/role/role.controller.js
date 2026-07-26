const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const roleService = require("./role.service");

const getAllRoles = catchAsync(async (req, res) => {
  const roles = await roleService.getAllRoles();
  ApiResponse.success(res, roles, "Roles retrieved successfully");
});

const getRoleById = catchAsync(async (req, res) => {
  const role = await roleService.getRoleById(req.params.id);
  ApiResponse.success(res, role, "Role details retrieved");
});

const createRole = catchAsync(async (req, res) => {
  const role = await roleService.createRole(req.body);
  ApiResponse.created(res, role, "Role created successfully");
});

const updateRole = catchAsync(async (req, res) => {
  const role = await roleService.updateRole(req.params.id, req.body);
  ApiResponse.success(res, role, "Role updated successfully");
});

const deleteRole = catchAsync(async (req, res) => {
  const result = await roleService.deleteRole(req.params.id);
  ApiResponse.success(res, result, "Role deleted successfully");
});

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
