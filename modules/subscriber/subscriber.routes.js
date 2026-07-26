const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const ctrl = require("./subscriber.controller");

// Public — anyone can subscribe
router.post("/subscribe", ctrl.subscribe);
router.post("/unsubscribe", ctrl.unsubscribe);

// Admin only
router.get("/", protect, authorize("super_admin", "admin", "ceo", "md"), ctrl.getAll);
router.get("/export", protect, authorize("super_admin", "admin", "ceo", "md"), ctrl.exportCSV);
router.delete("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), ctrl.remove);

module.exports = router;
