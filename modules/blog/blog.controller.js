const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const blogService = require("./blog.service");

const getAllBlogs = catchAsync(async (req, res) => {
  const result = await blogService.getAllBlogs(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getMyBlogs = catchAsync(async (req, res) => {
  const blogs = await blogService.getMyBlogs(req.user._id);
  ApiResponse.success(res, blogs, "Student blogs retrieved");
});

const getBlogBySlug = catchAsync(async (req, res) => {
  const blog = await blogService.getBlogBySlug(req.params.slug);
  ApiResponse.success(res, blog);
});

const createBlog = catchAsync(async (req, res) => {
  const blog = await blogService.createBlog(req.body, req.user);
  ApiResponse.created(res, blog, req.user.role === "user" ? "Blog submitted for approval" : "Blog created");
});

const updateBlog = catchAsync(async (req, res) => {
  const blog = await blogService.updateBlog(req.params.id, req.body);
  ApiResponse.success(res, blog, "Blog updated");
});

const approveBlog = catchAsync(async (req, res) => {
  const blog = await blogService.approveBlog(req.params.id);
  ApiResponse.success(res, blog, "Blog approved and published");
});

const rejectBlog = catchAsync(async (req, res) => {
  const blog = await blogService.rejectBlog(req.params.id, req.body.reason);
  ApiResponse.success(res, blog, "Blog rejected");
});

const addReaction = catchAsync(async (req, res) => {
  const result = await blogService.addReaction(req.params.slug, req.body.type);
  ApiResponse.success(res, result, "Reaction recorded");
});

const getComments = catchAsync(async (req, res) => {
  const comments = await blogService.getComments(req.params.slug);
  ApiResponse.success(res, comments, "Comments retrieved");
});

const addComment = catchAsync(async (req, res) => {
  const result = await blogService.addComment(req.params.slug, req.body, req.user);
  ApiResponse.created(res, result, "Comment posted successfully");
});

const likeComment = catchAsync(async (req, res) => {
  const result = await blogService.likeComment(req.params.slug, req.params.commentId);
  ApiResponse.success(res, result, "Comment liked");
});

const getRelatedBlogs = catchAsync(async (req, res) => {
  const blogs = await blogService.getRelatedBlogs(req.params.slug);
  ApiResponse.success(res, blogs, "Related articles retrieved");
});

const deleteBlog = catchAsync(async (req, res) => {
  await blogService.deleteBlog(req.params.id);
  ApiResponse.noContent(res);
});

module.exports = {
  getAllBlogs,
  getMyBlogs,
  getBlogBySlug,
  addReaction,
  getComments,
  addComment,
  likeComment,
  getRelatedBlogs,
  createBlog,
  updateBlog,
  approveBlog,
  rejectBlog,
  deleteBlog,
};

