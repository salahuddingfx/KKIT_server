const express = require("express");
const router = express.Router();
const { protect, optionalAuth } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const ctrl = require("./portfolio.controller");

router.get("/", optionalAuth, ctrl.getAll);
router.get("/slug/:slug", optionalAuth, ctrl.getBySlug);
router.get("/:id", optionalAuth, ctrl.getById);

router.use(protect);
router.post("/", authorize("super_admin", "admin", "ceo", "md"), ctrl.create);
router.put("/:id", authorize("super_admin", "admin", "ceo", "md"), ctrl.update);
router.delete("/:id", authorize("super_admin", "admin", "ceo", "md"), ctrl.remove);

module.exports = router;
