const categoryService = require("./category.service");
const ApiResponse = require("../../utils/apiResponse");
const catchAsync = require("../../utils/catchAsync");

const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAll(req.query);
  ApiResponse.success(res, categories, "Categories fetched");
});

const getCategoryById = catchAsync(async (req, res) => {
  const category = await categoryService.getById(req.params.id);
  if (!category) return ApiResponse.success(res, null, "Category not found", 404);
  ApiResponse.success(res, category, "Category fetched");
});

const getCategoryBySlug = catchAsync(async (req, res) => {
  const category = await categoryService.getBySlug(req.params.slug);
  if (!category) return ApiResponse.success(res, null, "Category not found", 404);
  ApiResponse.success(res, category, "Category fetched");
});

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.create(req.body);
  ApiResponse.created(res, category, "Category created");
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body);
  if (!category) return ApiResponse.success(res, null, "Category not found", 404);
  ApiResponse.success(res, category, "Category updated");
});

const deleteCategory = catchAsync(async (req, res) => {
  const category = await categoryService.remove(req.params.id);
  if (!category) return ApiResponse.success(res, null, "Category not found", 404);
  ApiResponse.success(res, null, "Category deleted");
});

module.exports = { getCategories, getCategoryById, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
