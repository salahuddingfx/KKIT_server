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
  let blog = await Blog.findOne({ slug }).populate("author", "name avatar designation");
  if (!blog && !isNaN(Number(slug))) {
    blog = await Blog.findById(Number(slug)).populate("author", "name avatar designation");
  }
  if (!blog) throw ApiError.notFound("Blog not found");
  blog.views += 1;
  await blog.save();
  return blog;
};

const addReaction = async (identifier, type) => {
  let blog = await Blog.findOne({ slug: identifier });
  if (!blog && !isNaN(Number(identifier))) {
    blog = await Blog.findById(Number(identifier));
  }
  if (!blog) throw ApiError.notFound("Blog not found");

  const validTypes = ["like", "love", "fire", "clap", "insightful"];
  const reactionType = validTypes.includes(type) ? type : "like";

  let reactions = blog.reactions || {
    like: 0,
    love: 0,
    fire: 0,
    clap: 0,
    insightful: 0,
  };

  reactions = {
    ...reactions,
    [reactionType]: (Number(reactions[reactionType]) || 0) + 1,
  };

  const totalLikes = Object.values(reactions).reduce((acc, count) => acc + (Number(count) || 0), 0);

  blog.reactions = reactions;
  blog.likes = totalLikes;
  await blog.save();

  return {
    reactions: blog.reactions,
    likes: blog.likes,
    userReaction: reactionType,
  };
};

const getComments = async (identifier) => {
  let blog = await Blog.findOne({ slug: identifier });
  if (!blog && !isNaN(Number(identifier))) {
    blog = await Blog.findById(Number(identifier));
  }
  if (!blog) throw ApiError.notFound("Blog not found");

  return blog.comments || [];
};

const addComment = async (identifier, commentData, user) => {
  let blog = await Blog.findOne({ slug: identifier });
  if (!blog && !isNaN(Number(identifier))) {
    blog = await Blog.findById(Number(identifier));
  }
  if (!blog) throw ApiError.notFound("Blog not found");

  const content = (commentData.content || "").trim();
  if (!content) {
    throw ApiError.badRequest("Comment content is required");
  }

  const newComment = {
    id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    content,
    name: user?.name || commentData.name || "Anonymous Reader",
    email: user?.email || commentData.email || "",
    avatar: user?.avatar || commentData.avatar || null,
    userId: user?._id || user?.id || null,
    role: user?.role || "reader",
    parentId: commentData.parentId || null,
    likes: 0,
    createdAt: new Date().toISOString(),
    replies: [],
  };

  const existingComments = Array.isArray(blog.comments) ? [...blog.comments] : [];

  if (newComment.parentId) {
    let added = false;
    for (const parent of existingComments) {
      if (parent.id === newComment.parentId) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(newComment);
        added = true;
        break;
      }
    }
    if (!added) {
      existingComments.unshift(newComment);
    }
  } else {
    existingComments.unshift(newComment);
  }

  blog.comments = existingComments;
  await blog.save();

  return {
    comment: newComment,
    comments: blog.comments,
    totalComments: existingComments.length,
  };
};

const likeComment = async (identifier, commentId) => {
  let blog = await Blog.findOne({ slug: identifier });
  if (!blog && !isNaN(Number(identifier))) {
    blog = await Blog.findById(Number(identifier));
  }
  if (!blog) throw ApiError.notFound("Blog not found");

  const comments = Array.isArray(blog.comments) ? [...blog.comments] : [];

  let likedComment = null;
  for (const c of comments) {
    if (c.id === commentId) {
      c.likes = (c.likes || 0) + 1;
      likedComment = c;
      break;
    }
    if (c.replies && c.replies.length > 0) {
      for (const r of c.replies) {
        if (r.id === commentId) {
          r.likes = (r.likes || 0) + 1;
          likedComment = r;
          break;
        }
      }
    }
  }

  blog.comments = comments;
  await blog.save();

  return {
    comment: likedComment,
    comments: blog.comments,
  };
};

const getRelatedBlogs = async (identifier) => {
  let blog = await Blog.findOne({ slug: identifier });
  if (!blog && !isNaN(Number(identifier))) {
    blog = await Blog.findById(Number(identifier));
  }
  if (!blog) return [];

  const currentId = blog.id;
  const filter = {
    status: "published",
  };
  if (currentId) {
    filter.id = { $ne: currentId };
  }

  const allPublished = await Blog.find(filter)
    .limit(4)
    .populate("author", "name avatar designation")
    .lean();

  return allPublished || [];
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

