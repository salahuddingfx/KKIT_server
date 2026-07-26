const LearningPath = require("./learning-path.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getAllPaths = async (query, options) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }
  return paginate(LearningPath, filter, {
    ...options,
    populate: "courses.course",
  });
};

const getPathById = async (id) => {
  const path = await LearningPath.findById(id).populate("courses.course");
  if (!path) throw ApiError.notFound("Learning path not found");
  return path;
};

const getPathBySlug = async (slug) => {
  const path = await LearningPath.findOne({ slug }).populate("courses.course");
  if (!path) throw ApiError.notFound("Learning path not found");
  return path;
};

const createPath = async (data) => {
  return LearningPath.create(data);
};

const updatePath = async (id, data) => {
  const path = await LearningPath.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!path) throw ApiError.notFound("Learning path not found");
  return path;
};

const deletePath = async (id) => {
  const path = await LearningPath.findByIdAndDelete(id);
  if (!path) throw ApiError.notFound("Learning path not found");
  return path;
};

module.exports = {
  getAllPaths,
  getPathById,
  getPathBySlug,
  createPath,
  updatePath,
  deletePath,
};
