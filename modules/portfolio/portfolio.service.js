const Portfolio = require("./portfolio.model");
const { slugify } = require("../../utils/helpers");
const { paginate } = require("../../utils/pagination");
const ApiError = require("../../utils/apiError");

const getAll = async (query = {}, options = {}) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.category && query.category !== "All") {
    filter.category = query.category;
  }

  if (query.projectType && query.projectType !== "all") {
    filter.projectType = query.projectType;
  }

  if (query.isCaseStudy !== undefined) {
    filter.isCaseStudy = query.isCaseStudy === "true" || query.isCaseStudy === true || query.isCaseStudy === 1;
  }

  if (query.isFeatured !== undefined || query.featured !== undefined) {
    const val = query.isFeatured !== undefined ? query.isFeatured : query.featured;
    filter.isFeatured = val === "true" || val === true || val === 1;
  }

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { client: { $regex: query.search, $options: "i" } },
      { studentName: { $regex: query.search, $options: "i" } },
      { category: { $regex: query.search, $options: "i" } },
    ];
  }

  return paginate(Portfolio, filter, { ...options, sort: { order: 1, createdAt: -1 } });
};

const getById = async (id) => {
  let item = null;
  // If it's a numeric ID or standard ID lookup
  if (/^\d+$/.test(String(id))) {
    item = await Portfolio.findById(id);
  }
  // If not found by ID, try finding by slug
  if (!item) {
    item = await Portfolio.findOne({ slug: id });
  }
  if (!item) throw ApiError.notFound("Portfolio item not found");
  return item;
};

const getBySlug = async (slug) => {
  const item = await Portfolio.findOne({ slug });
  if (!item) throw ApiError.notFound("Portfolio item not found");
  return item;
};

const create = async (data) => {
  if (data.title && !data.slug) {
    data.slug = slugify(data.title);
  }
  if (data.featured !== undefined && data.isFeatured === undefined) {
    data.isFeatured = Boolean(data.featured);
  }
  return Portfolio.create(data);
};

const update = async (id, data) => {
  if (data.title && !data.slug) {
    data.slug = slugify(data.title);
  }
  if (data.featured !== undefined && data.isFeatured === undefined) {
    data.isFeatured = Boolean(data.featured);
  }
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
