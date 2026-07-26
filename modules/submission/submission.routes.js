const express = require("express");
const router = express.Router();
const submissionController = require("./submission.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.use(protect);

// Student routes
router.get("/my", submissionController.getMySubmissions);
router.get("/my/grades", submissionController.getMyGrades);
router.post("/", submissionController.submitAssignment);
router.post("/:id/milestone/:milestoneIndex", submissionController.completeMilestone);

// Instructor/Admin routes
router.get("/", authorize("super_admin", "admin", "mentor", "trainer"), submissionController.getAllSubmissions);
router.get("/:id", submissionController.getSubmissionById);
router.post("/:id/grade", authorize("super_admin", "admin", "mentor", "trainer"), submissionController.gradeSubmission);
router.post("/:id/return", authorize("super_admin", "admin", "mentor", "trainer"), submissionController.returnSubmission);
router.delete("/:id", authorize("super_admin", "admin"), submissionController.deleteSubmission);

module.exports = router;
