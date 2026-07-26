const Partner = require("./partner.model");
const ApiError = require("../../utils/apiError");

const getAll = async (query = {}) => {
  const filter = {};
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";
  if (query.type) filter.type = query.type;
  if (query.search) {
    filter.name = { $regex: query.search, $options: "i" };
  }
  return Partner.find(filter).sort({ order: 1, name: 1 });
};

const getById = async (id) => {
  const partner = await Partner.findById(id);
  if (!partner) throw ApiError.notFound("Partner not found");
  return partner;
};

const getBySlug = async (slug) => {
  return Partner.findOne({ slug });
};

const create = async (data) => {
  return Partner.create(data);
};

const update = async (id, data) => {
  const partner = await Partner.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!partner) throw ApiError.notFound("Partner not found");
  return partner;
};

const remove = async (id) => {
  const partner = await Partner.findByIdAndDelete(id);
  if (!partner) throw ApiError.notFound("Partner not found");
  return partner;
};

module.exports = { getAll, getById, getBySlug, create, update, remove };
