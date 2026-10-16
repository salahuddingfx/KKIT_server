const admin = require("firebase-admin");
const Notification = require("./notification.model");
const ApiError = require("../../utils/apiError");

let firebaseInitialized = false;

const initFirebase = () => {
  if (firebaseInitialized) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    console.warn("Firebase credentials not configured. Push notifications disabled.");
    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, privateKey, clientEmail }),
    });
    firebaseInitialized = true;
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization failed:", error.message);
  }
};

const sendPushNotification = async (fcmToken, { title, body, data = {} }) => {
  if (!firebaseInitialized) {
    initFirebase();
  }
  if (!firebaseInitialized) {
    throw ApiError.internal("Push notification service not configured");
  }

  try {
    const message = {
      token: fcmToken,
      notification: { title, body },
      data: Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      ),
      webpush: {
        notification: {
          title,
          body,
          icon: "/icons/icon-192x192.png",
          badge: "/icons/badge-72x72.png",
        },
      },
    };

    const response = await admin.messaging().send(message);
    return { success: true, messageId: response };
  } catch (error) {
    if (
      error.code === "messaging/invalid-registration-token" ||
      error.code === "messaging/registration-token-not-registered"
    ) {
      return { success: false, error: "invalid_token" };
    }
    throw error;
  }
};

const sendBulkNotifications = async (tokens, { title, body, data = {} }) => {
  if (!firebaseInitialized) {
    initFirebase();
  }
  if (!firebaseInitialized) {
    throw ApiError.internal("Push notification service not configured");
  }

  if (!tokens.length) {
    return { successCount: 0, failureCount: 0 };
  }

  const message = {
    tokens,
    notification: { title, body },
    data: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)])
    ),
    webpush: {
      notification: {
        title,
        body,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
      },
    },
  };

  const response = await admin.messaging().sendEachForMulticast(message);
  return {
    successCount: response.successCount,
    failureCount: response.failureCount,
    failedTokens: response.responses
      .map((r, i) => (!r.success ? tokens[i] : null))
      .filter(Boolean),
  };
};

const createNotification = async (userId, { title, body, type = "info", data = {} }) => {
  const notification = await Notification.create({
    user: userId,
    title,
    body,
    type,
    data,
  });
  return notification;
};

const createAndSendNotification = async (userId, { title, body, type, data, fcmToken }) => {
  const notification = await createNotification(userId, { title, body, type, data });

  if (fcmToken) {
    try {
      const result = await sendPushNotification(fcmToken, { title, body, data });
      if (result.error === "invalid_token") {
        await User.findByIdAndUpdate(userId, {
          $pull: { fcmTokens: fcmToken },
        });
      }
    } catch (error) {
      console.error("Push notification failed:", error.message);
    }
  }

  return notification;
};

const getUserNotifications = async (userId, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ user: userId }),
  ]);

  return {
    notifications,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ user: userId, read: false });
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true, readAt: new Date() },
    { new: true }
  );
  if (!notification) {
    throw ApiError.notFound("Notification not found");
  }
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { user: userId, read: false },
    { read: true, readAt: new Date() }
  );
};

const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });
  if (!notification) {
    throw ApiError.notFound("Notification not found");
  }
};

module.exports = {
  initFirebase,
  sendPushNotification,
  sendBulkNotifications,
  createNotification,
  createAndSendNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
