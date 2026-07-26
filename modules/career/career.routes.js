const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const ctrl = require("./career.controller");

router.get("/", protect, ctrl.getAll);
router.get("/:id", protect, ctrl.getById);

router.post("/", protect, authorize("super_admin", "admin", "ceo", "md"), ctrl.create);
router.put("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), ctrl.update);
router.delete("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), ctrl.remove);

module.exports = router;
