const express = require("express");
const router = express.Router();
const enrollmentController = require("./enrollment.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.get("/recent", enrollmentController.getRecentPublicEnrollments);

router.use(protect);

router.get("/", enrollmentController.getAllEnrollments);
router.get("/:id", enrollmentController.getEnrollmentById);
router.put("/:id/status", authorize("super_admin", "admin", "mentor", "trainer"), enrollmentController.updateEnrollmentStatus);
router.post("/:id/complete", authorize("super_admin", "admin", "mentor", "trainer"), enrollmentController.markComplete);
router.post("/:id/complete-lesson", enrollmentController.toggleLessonComplete);

module.exports = router;
