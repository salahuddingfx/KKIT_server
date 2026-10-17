const express = require("express");
const router = express.Router();
const blogController = require("./blog.controller");
const { protect, optionalAuth } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const validate = require("../../middleware/validate");
const { createBlogSchema, updateBlogSchema } = require("./blog.validation");

// Public GET routes
router.get("/", optionalAuth, blogController.getAllBlogs);
router.get("/my-blogs", protect, blogController.getMyBlogs);
router.get("/:slug", optionalAuth, blogController.getBlogBySlug);
router.get("/:slug/comments", optionalAuth, blogController.getComments);
router.post("/:slug/comments", optionalAuth, blogController.addComment);
router.post("/:slug/comments/:commentId/like", optionalAuth, blogController.likeComment);
router.post("/:slug/reactions", optionalAuth, blogController.addReaction);
router.get("/:slug/related", optionalAuth, blogController.getRelatedBlogs);

// User submission route (any authenticated student/user can submit)
router.post("/", protect, validate(createBlogSchema), blogController.createBlog);

// Admin Moderation routes
router.put("/:id/approve", protect, authorize("super_admin", "admin", "ceo", "md"), blogController.approveBlog);
router.put("/:id/reject", protect, authorize("super_admin", "admin", "ceo", "md"), blogController.rejectBlog);

// Admin CRUD routes
router.put("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), validate(updateBlogSchema), blogController.updateBlog);
router.delete("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), blogController.deleteBlog);

module.exports = router;
