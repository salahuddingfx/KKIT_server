const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const service = require("./portfolio.service");

const getAll = catchAsync(async (req, res) => {
  const result = await service.getAll(req.query, { page: req.query.page, limit: req.query.limit });
  ApiResponse.paginated(res, result.data, result.meta);
});

const getById = catchAsync(async (req, res) => {
  const item = await service.getById(req.params.id);
  ApiResponse.success(res, item);
});

const getBySlug = catchAsync(async (req, res) => {
  const item = await service.getBySlug(req.params.slug);
  ApiResponse.success(res, item);
});

const create = catchAsync(async (req, res) => {
  const item = await service.create(req.body);
  ApiResponse.created(res, item);
});

const update = catchAsync(async (req, res) => {
  const item = await service.update(req.params.id, req.body);
  ApiResponse.success(res, item);
});

const remove = catchAsync(async (req, res) => {
  await service.remove(req.params.id);
  ApiResponse.success(res, null, "Portfolio item deleted");
});

module.exports = { getAll, getById, getBySlug, create, update, remove };
