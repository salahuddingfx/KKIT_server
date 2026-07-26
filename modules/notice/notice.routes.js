const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  markAsRead,
  getUnreadCount,
} = require("./notice.controller");

// Public routes (authenticated users can view)
router.get("/", protect, getNotices);
router.get("/unread/count", protect, getUnreadCount);
router.get("/:id", protect, getNoticeById);

// Admin/Mentor routes (create, update, delete)
router.post("/", protect, authorize("super_admin", "admin", "ceo", "md"), createNotice);
router.put("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), updateNotice);
router.delete("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), deleteNotice);

// User routes (mark as read)
router.post("/:id/read", protect, markAsRead);

module.exports = router;
