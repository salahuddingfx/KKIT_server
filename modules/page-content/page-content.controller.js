const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const service = require("./page-content.service");

const getByPage = catchAsync(async (req, res) => {
  const content = await service.getByPage(req.params.page);
  ApiResponse.success(res, content);
});

const getAllPages = catchAsync(async (req, res) => {
  const pages = await service.getAllPages();
  ApiResponse.success(res, pages);
});

const createOrUpdatePage = catchAsync(async (req, res) => {
  const content = await service.createOrUpdatePage(req.params.page, req.body);
  ApiResponse.success(res, content);
});

const updateSection = catchAsync(async (req, res) => {
  const content = await service.updateSection(req.params.page, req.params.sectionKey, req.body);
  ApiResponse.success(res, content);
});

const deletePage = catchAsync(async (req, res) => {
  await service.deletePage(req.params.page);
  ApiResponse.success(res, null, "Page content deleted");
});

module.exports = { getByPage, getAllPages, createOrUpdatePage, updateSection, deletePage };
