const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const { getCategories, getCategoryById, getCategoryBySlug, createCategory, updateCategory, deleteCategory } = require("./category.controller");

router.get("/", getCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategoryById);
router.post("/", protect, authorize("super_admin", "admin", "ceo", "md"), createCategory);
router.put("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), updateCategory);
router.delete("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), deleteCategory);

module.exports = router;
