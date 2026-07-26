const express = require("express");
const router = express.Router();
const leaderboardController = require("./leaderboard.controller");
const { protect } = require("../../middleware/auth");

router.use(protect);
router.get("/", leaderboardController.getLeaderboard);
router.get("/me", leaderboardController.getMyStats);

module.exports = router;
