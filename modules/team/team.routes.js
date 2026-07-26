const express = require("express");
const router = express.Router();
const teamController = require("./team.controller");
const { protect, optionalAuth } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.get("/", optionalAuth, teamController.getAllTeam);
router.get("/:slug", optionalAuth, teamController.getTeamBySlug);

router.use(protect);
router.post("/", authorize("super_admin", "admin"), teamController.createTeam);
router.put("/:id", authorize("super_admin", "admin"), teamController.updateTeam);
router.delete("/:id", authorize("super_admin", "admin"), teamController.deleteTeam);

module.exports = router;
