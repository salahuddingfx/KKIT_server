const Service = require("./service.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getAllServices = async (query, options) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }
  return paginate(Service, filter, options);
};

const getServiceBySlug = async (slug) => {
  const service = await Service.findOne({ slug });
  if (!service) throw ApiError.notFound("Service not found");
  return service;
};

const createService = async (data) => {
  return Service.create(data);
};

const updateService = async (id, data) => {
  const service = await Service.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!service) throw ApiError.notFound("Service not found");
  return service;
};

const deleteService = async (id) => {
  const service = await Service.findByIdAndDelete(id);
  if (!service) throw ApiError.notFound("Service not found");
  return service;
};

module.exports = { getAllServices, getServiceBySlug, createService, updateService, deleteService };
