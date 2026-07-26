const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const service = require("./site-setting.service");

const getAll = catchAsync(async (req, res) => {
  const settings = await service.getAll(req.query.category);
  ApiResponse.success(res, settings);
});

const getByKey = catchAsync(async (req, res) => {
  const setting = await service.getByKey(req.params.key);
  ApiResponse.success(res, setting);
});

const setByKey = catchAsync(async (req, res) => {
  const { value, type, category, label, description } = req.body;
  const setting = await service.setByKey(req.params.key, value, type, category, label, description);
  ApiResponse.success(res, setting);
});

const bulkUpdate = catchAsync(async (req, res) => {
  const settings = await service.bulkUpdate(req.body.settings);
  ApiResponse.success(res, settings);
});

const deleteKey = catchAsync(async (req, res) => {
  await service.deleteKey(req.params.key);
  ApiResponse.success(res, null, "Setting deleted");
});

module.exports = { getAll, getByKey, setByKey, bulkUpdate, deleteKey };
