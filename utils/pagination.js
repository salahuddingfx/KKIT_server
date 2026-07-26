const { calculatePagination } = require("./helpers");

const paginate = async (model, query = {}, options = {}) => {
  const { page = 1, limit = 10, sort = "-createdAt", populate = "" } = options;
  const { page: pageNum, limit: limitNum, skip } = calculatePagination(page, limit);

  const [data, total] = await Promise.all([
    model.find(query).sort(sort).skip(skip).limit(limitNum).populate(populate).lean(),
    model.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  };
};

module.exports = { paginate };
