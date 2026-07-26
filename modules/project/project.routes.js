const express = require("express");
const router = express.Router();
const projectController = require("./project.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

const isInstructor = authorize("super_admin", "admin", "mentor", "trainer");

router.use(protect);

// Student routes
router.get("/", projectController.getMyProjects);
router.post("/", projectController.createProject);
router.post("/:id/submit", projectController.submitProject);
router.post("/:id/milestone/:milestoneIndex", projectController.completeMilestone);

// Shared routes (ownership check in service)
router.get("/:id", projectController.getProjectById);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

// Instructor/Admin only
router.get("/admin/all", isInstructor, projectController.getAllProjects);
router.put("/:id/approve", isInstructor, projectController.approveProject);
router.put("/:id/revision", isInstructor, projectController.requestRevision);

module.exports = router;
