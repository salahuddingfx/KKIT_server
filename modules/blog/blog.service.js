const Blog = require("./blog.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getAllBlogs = async (query, options) => {
  const filter = {};
  if (query.status) {
    if (query.status !== "all") {
      filter.status = query.status;
    }
  } else {
    // Default to published for public queries
    filter.status = "published";
  }

  if (query.category) filter.category = query.category;
  if (query.author) filter.author = query.author;
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { content: { $regex: query.search, $options: "i" } },
    ];
  }
  return paginate(Blog, filter, { ...options, populate: { path: "author", select: "name email avatar designation" } });
};

const getMyBlogs = async (userId) => {
  return Blog.find({ author: userId }).sort({ createdAt: -1 }).lean();
};

const getBlogBySlug = async (slug) => {
  const blog = await Blog.findOne({ slug }).populate("author", "name avatar designation");
  if (!blog) throw ApiError.notFound("Blog not found");
  blog.views += 1;
  await blog.save();
  return blog;
};

const createBlog = async (data, user) => {
  const isStaff = ["super_admin", "admin", "ceo", "md"].includes(user?.role);
  const blogData = {
    ...data,
    author: user._id,
    status: isStaff ? (data.status || "published") : "pending",
  };
  return Blog.create(blogData);
};

const updateBlog = async (id, data) => {
  const blog = await Blog.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!blog) throw ApiError.notFound("Blog not found");
  return blog;
};

const approveBlog = async (id) => {
  const blog = await Blog.findById(id);
  if (!blog) throw ApiError.notFound("Blog not found");
  blog.status = "published";
  blog.publishedAt = new Date();
  blog.rejectionReason = "";
  await blog.save();
  return blog;
};

const rejectBlog = async (id, reason) => {
  const blog = await Blog.findById(id);
  if (!blog) throw ApiError.notFound("Blog not found");
  blog.status = "rejected";
  blog.rejectionReason = reason || "Does not meet publication guidelines";
  await blog.save();
  return blog;
};

const deleteBlog = async (id) => {
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw ApiError.notFound("Blog not found");
  return blog;
};

module.exports = {
  getAllBlogs,
  getMyBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  approveBlog,
  rejectBlog,
  deleteBlog,
};
