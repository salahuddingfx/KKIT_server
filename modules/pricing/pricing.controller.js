const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const pricingService = require("./pricing.service");

const getAllPricing = catchAsync(async (req, res) => {
  const result = await pricingService.getAllPricing(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getPricingById = catchAsync(async (req, res) => {
  const pricing = await pricingService.getPricingById(req.params.id);
  ApiResponse.success(res, pricing);
});

const createPricing = catchAsync(async (req, res) => {
  const pricing = await pricingService.createPricing(req.body);
  ApiResponse.created(res, pricing);
});

const updatePricing = catchAsync(async (req, res) => {
  const pricing = await pricingService.updatePricing(req.params.id, req.body);
  ApiResponse.success(res, pricing, "Pricing updated");
});

const deletePricing = catchAsync(async (req, res) => {
  await pricingService.deletePricing(req.params.id);
  ApiResponse.noContent(res);
});

module.exports = { getAllPricing, getPricingById, createPricing, updatePricing, deletePricing };
