const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const userService = require("./user.service");

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userService.getAllUsers(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  ApiResponse.success(res, user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  ApiResponse.success(res, user, "User updated");
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  ApiResponse.noContent(res);
});

const changeUserRole = catchAsync(async (req, res) => {
  const user = await userService.changeUserRole(req.params.id, req.body.role);
  ApiResponse.success(res, user, "Role updated");
});

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, changeUserRole };
