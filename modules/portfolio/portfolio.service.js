const Portfolio = require("./portfolio.model");
const { slugify } = require("../../utils/helpers");
const { paginate } = require("../../utils/pagination");
const ApiError = require("../../utils/apiError");

const getAll = async (query, options) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  if (query.search) filter.$text = { $search: query.search };
  return paginate(Portfolio, filter, { ...options, sort: { order: 1, createdAt: -1 } });
};

const getById = async (id) => {
  const item = await Portfolio.findById(id);
  if (!item) throw ApiError.notFound("Portfolio item not found");
  return item;
};

const getBySlug = async (slug) => {
  const item = await Portfolio.findOne({ slug });
  if (!item) throw ApiError.notFound("Portfolio item not found");
  return item;
};

const create = async (data) => {
  data.slug = slugify(data.title);
  return Portfolio.create(data);
};

const update = async (id, data) => {
  if (data.title) data.slug = slugify(data.title);
  const item = await Portfolio.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!item) throw ApiError.notFound("Portfolio item not found");
  return item;
};

const remove = async (id) => {
  const item = await Portfolio.findByIdAndDelete(id);
  if (!item) throw ApiError.notFound("Portfolio item not found");
  return item;
};

module.exports = { getAll, getById, getBySlug, create, update, remove };
