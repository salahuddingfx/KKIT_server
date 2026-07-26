const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const service = require("./contact-submission.service");

// Public — submit contact form
const create = catchAsync(async (req, res) => {
  const submission = await service.create(req.body);
  ApiResponse.created(res, submission);
});

// Admin
const getAll = catchAsync(async (req, res) => {
  const result = await service.getAll(req.query, { page: req.query.page, limit: req.query.limit });
  ApiResponse.paginated(res, result.data, result.meta);
});

const getById = catchAsync(async (req, res) => {
  const item = await service.getById(req.params.id);
  // Auto-mark as read
  if (item.status === "new") {
    item.status = "read";
    await item.save();
  }
  ApiResponse.success(res, item);
});

const markAs = catchAsync(async (req, res) => {
  const item = await service.markAs(req.params.id, req.body.status, req.user._id);
  ApiResponse.success(res, item);
});

const remove = catchAsync(async (req, res) => {
  await service.remove(req.params.id);
  ApiResponse.success(res, null, "Submission deleted");
});

module.exports = { create, getAll, getById, markAs, remove };
