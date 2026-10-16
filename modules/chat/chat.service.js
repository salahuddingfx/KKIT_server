const ChatMessage = require("./chat.model");
const ApiError = require("../../utils/apiError");

const sendMessage = async ({ room, sender, content, type = "text" }) => {
  const message = await ChatMessage.create({
    room,
    sender,
    content,
    type,
  });

  return message.populate("sender", "name avatar");
};

const getRoomMessages = async (room, { page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;

  const messages = await ChatMessage.find({ room })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("sender", "name avatar")
    .lean();

  const total = await ChatMessage.countDocuments({ room });

  return {
    messages: messages.reverse(),
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const markAsRead = async (messageId, userId) => {
  const message = await ChatMessage.findById(messageId);
  if (!message) throw ApiError.notFound("Message not found");

  const alreadyRead = message.readBy.some(
    (r) => r.user.toString() === userId.toString()
  );

  if (!alreadyRead) {
    message.readBy.push({ user: userId, readAt: new Date() });
    await message.save();
  }

  return message;
};

const deleteMessage = async (messageId, userId) => {
  const message = await ChatMessage.findById(messageId);
  if (!message) throw ApiError.notFound("Message not found");
  if (message.sender.toString() !== userId.toString()) {
    throw ApiError.forbidden("Cannot delete other users' messages");
  }

  await ChatMessage.findByIdAndDelete(messageId);
};

module.exports = {
  sendMessage,
  getRoomMessages,
  markAsRead,
  deleteMessage,
};
