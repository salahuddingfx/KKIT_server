const express = require("express");
const router = express.Router();
const chatController = require("./chat.controller");
const { protect } = require("../../middleware/auth");

router.use(protect);

router.get("/:room", chatController.getRoomMessages);
router.put("/:messageId/read", chatController.markAsRead);
router.delete("/:messageId", chatController.deleteMessage);

module.exports = router;
