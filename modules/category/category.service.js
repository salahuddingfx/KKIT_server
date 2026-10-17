const Category = require("./category.model");
const Course = require("../course/course.model");

const getAll = async (query = {}) => {
  const filter = {};
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";
  if (query.search) {
    filter.name = { $regex: query.search, $options: "i" };
  }
  return Category.find(filter).sort({ order: 1, name: 1 });
};

const getById = async (id) => {
  return Category.findById(id);
};

const getBySlug = async (slug) => {
  return Category.findOne({ slug });
};

const create = async (data) => {
  return Category.create(data);
};

const update = async (id, data) => {
  return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const remove = async (id) => {
  return Category.findByIdAndDelete(id);
};

const updateCourseCount = async (categoryId) => {
  const count = await Course.countDocuments({ category: categoryId });
  return Category.findByIdAndUpdate(categoryId, { courseCount: count }, { new: true });
};

const updateAllCounts = async () => {
  const categories = await Category.find();
  for (const cat of categories) {
    const count = await Course.countDocuments({ category: cat._id || cat.id });
    cat.courseCount = count;
    await cat.save();
  }
};

module.exports = { getAll, getById, getBySlug, create, update, remove, updateCourseCount, updateAllCounts };
