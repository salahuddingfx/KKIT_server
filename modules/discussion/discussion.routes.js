const express = require("express");
const router = express.Router();
const discussionController = require("./discussion.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.get("/", discussionController.getAllDiscussions);
router.get("/:id", discussionController.getDiscussionById);

router.use(protect);
router.post("/", discussionController.createDiscussion);
router.put("/:id", discussionController.updateDiscussion);
router.delete("/:id", discussionController.deleteDiscussion);
router.post("/:id/replies", discussionController.addReply);
router.put("/:id/resolve", discussionController.toggleResolved);
router.put("/:id/pin", authorize("super_admin", "admin"), discussionController.togglePin);
router.post("/:id/replies/:replyId/like", discussionController.likeReply);

module.exports = router;
