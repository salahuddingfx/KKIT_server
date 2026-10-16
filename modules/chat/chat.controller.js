const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const chatService = require("./chat.service");

const getRoomMessages = catchAsync(async (req, res) => {
  const { room } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const result = await chatService.getRoomMessages(room, {
    page: parseInt(page),
    limit: parseInt(limit),
  });
  ApiResponse.success(res, result);
});

const markAsRead = catchAsync(async (req, res) => {
  const { messageId } = req.params;
  const message = await chatService.markAsRead(messageId, req.user._id);
  ApiResponse.success(res, message);
});

const deleteMessage = catchAsync(async (req, res) => {
  const { messageId } = req.params;
  await chatService.deleteMessage(messageId, req.user._id);
  ApiResponse.noContent(res);
});

module.exports = {
  getRoomMessages,
  markAsRead,
  deleteMessage,
};
