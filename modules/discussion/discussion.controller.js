const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const discussionService = require("./discussion.service");
const { emitEvent } = require("../gamification/gamification.service");

const getAllDiscussions = catchAsync(async (req, res) => {
  const result = await discussionService.getAllDiscussions(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getDiscussionById = catchAsync(async (req, res) => {
  const discussion = await discussionService.getDiscussionById(req.params.id);
  ApiResponse.success(res, discussion);
});

const createDiscussion = catchAsync(async (req, res) => {
  req.body.author = req.user._id;
  const discussion = await discussionService.createDiscussion(req.body);
  emitEvent("discussion_create", { userId: req.user._id.toString() });
  ApiResponse.created(res, discussion);
});

const updateDiscussion = catchAsync(async (req, res) => {
  const discussion = await discussionService.updateDiscussion(req.params.id, req.body);
  ApiResponse.success(res, discussion, "Discussion updated");
});

const deleteDiscussion = catchAsync(async (req, res) => {
  await discussionService.deleteDiscussion(req.params.id);
  ApiResponse.noContent(res);
});

const addReply = catchAsync(async (req, res) => {
  const replyData = {
    author: req.user._id,
    content: req.body.content,
  };
  const discussion = await discussionService.addReply(req.params.id, replyData);
  emitEvent("discussion_reply", { userId: req.user._id.toString() });
  ApiResponse.created(res, discussion, "Reply added");
});

const toggleResolved = catchAsync(async (req, res) => {
  const discussion = await discussionService.toggleResolved(req.params.id);
  ApiResponse.success(
    res,
    discussion,
    discussion.isResolved ? "Discussion marked as resolved" : "Discussion marked as unresolved"
  );
});

const togglePin = catchAsync(async (req, res) => {
  const discussion = await discussionService.togglePin(req.params.id);
  ApiResponse.success(
    res,
    discussion,
    discussion.isPinned ? "Discussion pinned" : "Discussion unpinned"
  );
});

const likeReply = catchAsync(async (req, res) => {
  const discussion = await discussionService.likeReply(
    req.params.id,
    req.params.replyId,
    req.user._id
  );
  ApiResponse.success(res, discussion, "Reply like toggled");
});

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
