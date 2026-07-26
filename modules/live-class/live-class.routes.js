const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const {
  getLiveClasses,
  getLiveClassById,
  getUpcomingClasses,
  createLiveClass,
  updateLiveClass,
  deleteLiveClass,
  joinLiveClass,
} = require("./live-class.controller");

router.get("/", getLiveClasses);
router.get("/upcoming", getUpcomingClasses);
router.get("/:id", getLiveClassById);
router.post("/", protect, authorize("super_admin", "admin", "ceo", "md"), createLiveClass);
router.put("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), updateLiveClass);
router.delete("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), deleteLiveClass);
router.post("/:id/join", protect, joinLiveClass);

module.exports = router;
