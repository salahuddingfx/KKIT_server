const Career = require("./career.model");
const { slugify } = require("../../utils/helpers");
const { paginate } = require("../../utils/pagination");
const ApiError = require("../../utils/apiError");

const getAll = async (query, options) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.department) filter.department = query.department;
  if (query.type) filter.type = query.type;
  if (query.search) filter.$text = { $search: query.search };
  return paginate(Career, filter, { ...options, sort: { order: 1, createdAt: -1 } });
};

const getById = async (id) => {
  const item = await Career.findById(id);
  if (!item) throw ApiError.notFound("Career not found");
  return item;
};

const create = async (data) => {
  data.slug = slugify(data.title);
  return Career.create(data);
};

const update = async (id, data) => {
  if (data.title) data.slug = slugify(data.title);
  const item = await Career.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!item) throw ApiError.notFound("Career not found");
  return item;
};

const remove = async (id) => {
  const item = await Career.findByIdAndDelete(id);
  if (!item) throw ApiError.notFound("Career not found");
  return item;
};

module.exports = { getAll, getById, create, update, remove };
