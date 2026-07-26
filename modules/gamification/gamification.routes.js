const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { getMyGamification, getAllBadges, getLeaderboard } = require("./gamification.controller");

router.get("/me", protect, getMyGamification);
router.get("/badges", getAllBadges);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
