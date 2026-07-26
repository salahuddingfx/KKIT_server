const Pricing = require("./pricing.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getAllPricing = async (query, options) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  return paginate(Pricing, filter, options);
};

const getPricingById = async (id) => {
  const pricing = await Pricing.findById(id);
  if (!pricing) throw ApiError.notFound("Pricing plan not found");
  return pricing;
};

const createPricing = async (data) => {
  return Pricing.create(data);
};

const updatePricing = async (id, data) => {
  const pricing = await Pricing.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!pricing) throw ApiError.notFound("Pricing plan not found");
  return pricing;
};

const deletePricing = async (id) => {
  const pricing = await Pricing.findByIdAndDelete(id);
  if (!pricing) throw ApiError.notFound("Pricing plan not found");
  return pricing;
};

module.exports = { getAllPricing, getPricingById, createPricing, updatePricing, deletePricing };
