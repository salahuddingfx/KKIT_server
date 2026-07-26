const express = require("express");
const router = express.Router();
const assignmentController = require("./assignment.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.use(protect);

router.get("/", assignmentController.getAllAssignments);
router.get("/:id", assignmentController.getAssignmentById);
router.get("/:id/stats", authorize("super_admin", "admin", "mentor", "trainer"), assignmentController.getAssignmentStats);

router.post("/", authorize("super_admin", "admin", "mentor", "trainer"), assignmentController.createAssignment);
router.put("/:id", authorize("super_admin", "admin", "mentor", "trainer"), assignmentController.updateAssignment);
router.delete("/:id", authorize("super_admin", "admin", "mentor"), assignmentController.deleteAssignment);

router.post("/:id/assign", authorize("super_admin", "admin", "mentor"), assignmentController.assignToStudents);
router.delete("/:id/assign/:userId", authorize("super_admin", "admin", "mentor"), assignmentController.unassignStudent);

module.exports = router;
