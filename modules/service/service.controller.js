const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const serviceService = require("./service.service");

const getAllServices = catchAsync(async (req, res) => {
  const result = await serviceService.getAllServices(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getServiceBySlug = catchAsync(async (req, res) => {
  const service = await serviceService.getServiceBySlug(req.params.slug);
  ApiResponse.success(res, service);
});

const createService = catchAsync(async (req, res) => {
  const service = await serviceService.createService(req.body);
  ApiResponse.created(res, service);
});

const updateService = catchAsync(async (req, res) => {
  const service = await serviceService.updateService(req.params.id, req.body);
  ApiResponse.success(res, service, "Service updated");
});

const deleteService = catchAsync(async (req, res) => {
  await serviceService.deleteService(req.params.id);
  ApiResponse.noContent(res);
});

module.exports = { getAllServices, getServiceBySlug, createService, updateService, deleteService };
