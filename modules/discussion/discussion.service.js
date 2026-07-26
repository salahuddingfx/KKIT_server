const Discussion = require("./discussion.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getAllDiscussions = async (query, options) => {
  const filter = {};
  if (query.course) filter.course = query.course;
  if (query.lessonId) filter.lessonId = query.lessonId;
  if (query.type) filter.type = query.type;
  if (query.author) filter.author = query.author;
  if (query.isResolved !== undefined) filter.isResolved = query.isResolved;
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { content: { $regex: query.search, $options: "i" } },
    ];
  }
  return paginate(Discussion, filter, {
    ...options,
    populate: [
      { path: "author", select: "name avatar role designation" },
      { path: "replies.author", select: "name avatar role designation" },
    ],
    sort: options.sort || "-isPinned -createdAt",
  });
};

const getDiscussionById = async (id) => {
  const discussion = await Discussion.findById(id)
    .populate("author", "name avatar role")
    .populate("replies.author", "name avatar role");
  if (!discussion) throw ApiError.notFound("Discussion not found");
  discussion.views += 1;
  await discussion.save();
  return discussion;
};

const createDiscussion = async (data) => {
  return Discussion.create(data);
};

const updateDiscussion = async (id, data) => {
  const discussion = await Discussion.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!discussion) throw ApiError.notFound("Discussion not found");
  return discussion;
};

const deleteDiscussion = async (id) => {
  const discussion = await Discussion.findByIdAndDelete(id);
  if (!discussion) throw ApiError.notFound("Discussion not found");
  return discussion;
};

const addReply = async (discussionId, replyData) => {
  const discussion = await Discussion.findById(discussionId);
  if (!discussion) throw ApiError.notFound("Discussion not found");
  discussion.replies.push(replyData);
  await discussion.save();
  return discussion;
};

const toggleResolved = async (discussionId) => {
  const discussion = await Discussion.findById(discussionId);
  if (!discussion) throw ApiError.notFound("Discussion not found");
  discussion.isResolved = !discussion.isResolved;
  await discussion.save();
  return discussion;
};

const togglePin = async (discussionId) => {
  const discussion = await Discussion.findById(discussionId);
  if (!discussion) throw ApiError.notFound("Discussion not found");
  discussion.isPinned = !discussion.isPinned;
  await discussion.save();
  return discussion;
};

const likeReply = async (discussionId, replyId, userId) => {
  const discussion = await Discussion.findById(discussionId);
  if (!discussion) throw ApiError.notFound("Discussion not found");

  const reply = discussion.replies.id(replyId);
  if (!reply) throw ApiError.notFound("Reply not found");

  const likeIndex = reply.likes.indexOf(userId);
  if (likeIndex > -1) {
    reply.likes.splice(likeIndex, 1);
  } else {
    reply.likes.push(userId);
  }
  await discussion.save();
  return discussion;
};

module.exports = {
  getAllDiscussions,
  getDiscussionById,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addReply,
  toggleResolved,
  togglePin,
  likeReply,
};
