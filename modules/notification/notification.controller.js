const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const notificationService = require("./notification.service");
const User = require("../user/user.model");
const ApiError = require("../../utils/apiError");

const registerToken = catchAsync(async (req, res) => {
  const { fcmToken } = req.body;
  if (!fcmToken) {
    throw ApiError.badRequest("FCM token is required");
  }

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { fcmTokens: fcmToken },
  });

  ApiResponse.success(res, null, "Token registered successfully");
});

const removeToken = catchAsync(async (req, res) => {
  const { fcmToken } = req.body;
  if (!fcmToken) {
    throw ApiError.badRequest("FCM token is required");
  }

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { fcmTokens: fcmToken },
  });

  ApiResponse.success(res, null, "Token removed successfully");
});

const sendNotification = catchAsync(async (req, res) => {
  const { userId, title, body, type, data } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const notification = await notificationService.createAndSendNotification(userId, {
    title,
    body,
    type,
    data,
    fcmToken: user.fcmTokens?.[0],
  });

  ApiResponse.created(res, notification, "Notification sent successfully");
});

const sendBulkNotification = catchAsync(async (req, res) => {
  const { userIds, title, body, type, data, sendPush } = req.body;

  if (!userIds?.length) {
    throw ApiError.badRequest("User IDs are required");
  }

  const users = await User.find({ _id: { $in: userIds } });
  const notifications = [];

  for (const user of users) {
    const notification = await notificationService.createNotification(user._id, {
      title,
      body,
      type,
      data,
    });
    notifications.push(notification);
  }

  if (sendPush !== false) {
    const allTokens = users
      .flatMap((u) => u.fcmTokens || [])
      .filter(Boolean);

    if (allTokens.length) {
      await notificationService.sendBulkNotifications(allTokens, {
        title,
        body,
        data,
      });
    }
  }

  ApiResponse.created(
    res,
    { sent: notifications.length },
    "Bulk notifications sent successfully"
  );
});

const getNotifications = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await notificationService.getUserNotifications(req.user._id, {
    page: parseInt(page),
    limit: parseInt(limit),
  });
  ApiResponse.success(res, result);
});

const getUnreadCount = catchAsync(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user._id);
  ApiResponse.success(res, { count });
});

const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(
    req.params.id,
    req.user._id
  );
  ApiResponse.success(res, notification);
});

const markAllAsRead = catchAsync(async (req, res) => {
  await notificationService.markAllAsRead(req.user._id);
  ApiResponse.success(res, null, "All notifications marked as read");
});

const deleteNotification = catchAsync(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.user._id);
  ApiResponse.noContent(res);
});

module.exports = {
  registerToken,
  removeToken,
  sendNotification,
  sendBulkNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
