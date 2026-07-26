const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const ctrl = require("./page-content.controller");

// Public — any auth user can read page content
router.get("/", protect, ctrl.getAllPages);
router.get("/:page", protect, ctrl.getByPage);

// Admin only — write
router.put("/:page", protect, authorize("super_admin", "admin", "ceo", "md"), ctrl.createOrUpdatePage);
router.put("/:page/:sectionKey", protect, authorize("super_admin", "admin", "ceo", "md"), ctrl.updateSection);
router.delete("/:page", protect, authorize("super_admin", "admin", "ceo", "md"), ctrl.deletePage);

module.exports = router;
