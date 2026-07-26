const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const { getStats, getStatById, createStat, updateStat, deleteStat } = require("./home-stat.controller");

router.get("/", getStats);
router.get("/:id", getStatById);
router.post("/", protect, authorize("super_admin", "admin", "ceo", "md"), createStat);
router.put("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), updateStat);
router.delete("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), deleteStat);

module.exports = router;
