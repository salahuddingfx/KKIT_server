const express = require("express");
const router = express.Router();
const notificationController = require("./notification.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.post("/register-token", protect, notificationController.registerToken);
router.post("/remove-token", protect, notificationController.removeToken);
router.get("/", protect, notificationController.getNotifications);
router.get("/unread-count", protect, notificationController.getUnreadCount);
router.put("/read-all", protect, notificationController.markAllAsRead);
router.put("/read/:id", protect, notificationController.markAsRead);
router.delete("/:id", protect, notificationController.deleteNotification);

router.post(
  "/send",
  protect,
  authorize("super_admin", "admin", "ceo", "md"),
  notificationController.sendNotification
);
router.post(
  "/send-bulk",
  protect,
  authorize("super_admin", "admin", "ceo", "md"),
  notificationController.sendBulkNotification
);

module.exports = router;
