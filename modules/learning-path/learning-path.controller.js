const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const learningPathService = require("./learning-path.service");

const getAllPaths = catchAsync(async (req, res) => {
  const result = await learningPathService.getAllPaths(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getPathById = catchAsync(async (req, res) => {
  const path = await learningPathService.getPathById(req.params.id);
  ApiResponse.success(res, path);
});

const getPathBySlug = catchAsync(async (req, res) => {
  const path = await learningPathService.getPathBySlug(req.params.slug);
  ApiResponse.success(res, path);
});

const createPath = catchAsync(async (req, res) => {
  const path = await learningPathService.createPath(req.body);
  ApiResponse.created(res, path);
});

const updatePath = catchAsync(async (req, res) => {
  const path = await learningPathService.updatePath(req.params.id, req.body);
  ApiResponse.success(res, path, "Learning path updated");
});

const deletePath = catchAsync(async (req, res) => {
  await learningPathService.deletePath(req.params.id);
  ApiResponse.noContent(res);
});

module.exports = {
  getAllPaths,
  getPathById,
  getPathBySlug,
  createPath,
  updatePath,
  deletePath,
};
