const HomeStat = require("./home-stat.model");
const ApiError = require("../../utils/apiError");

const getAll = async (query = {}) => {
  const filter = {};
  if (query.section) filter.section = query.section;
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";
  return HomeStat.find(filter).sort({ order: 1 });
};

const getById = async (id) => {
  const stat = await HomeStat.findById(id);
  if (!stat) throw ApiError.notFound("Stat not found");
  return stat;
};

const create = async (data) => {
  return HomeStat.create(data);
};

const update = async (id, data) => {
  const stat = await HomeStat.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!stat) throw ApiError.notFound("Stat not found");
  return stat;
};

const remove = async (id) => {
  const stat = await HomeStat.findByIdAndDelete(id);
  if (!stat) throw ApiError.notFound("Stat not found");
  return stat;
};

const getStats = async (section) => {
  return HomeStat.find({ section, isActive: true }).sort({ order: 1 });
};

module.exports = { getAll, getById, create, update, remove, getStats };
