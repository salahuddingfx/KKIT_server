const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const ctrl = require("./contact-submission.controller");

// Public — submit contact form
router.post("/", ctrl.create);

// Admin only
router.get("/", protect, authorize("super_admin", "admin", "ceo", "md"), ctrl.getAll);
router.get("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), ctrl.getById);
router.put("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), ctrl.markAs);
router.delete("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), ctrl.remove);

module.exports = router;
