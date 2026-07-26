const express = require("express");
const router = express.Router();
const courseController = require("./course.controller");
const { protect, optionalAuth } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const validate = require("../../middleware/validate");
const { createCourseSchema, updateCourseSchema } = require("./course.validation");

router.get("/", optionalAuth, courseController.getAllCourses);
router.get("/slug/:slug", optionalAuth, courseController.getCourseBySlug);
router.get("/:id", optionalAuth, courseController.getCourseById);

// Module download request (public)
router.post("/:id/modules/:moduleId/download", courseController.requestModuleDownload);

// Course outline download request (public)
router.post("/:id/outline/download", courseController.requestCourseOutline);

router.use(protect);
router.post("/", authorize("super_admin", "admin", "trainer"), validate(createCourseSchema), courseController.createCourse);
router.put("/:id", authorize("super_admin", "admin", "trainer"), validate(updateCourseSchema), courseController.updateCourse);
router.delete("/:id", authorize("super_admin", "admin"), courseController.deleteCourse);
router.post("/:id/enroll", courseController.enrollInCourse);

// Course assignment
router.post("/:id/assign/mentor", authorize("super_admin", "admin"), courseController.assignMentor);
router.delete("/:id/assign/mentor/:userId", authorize("super_admin", "admin"), courseController.unassignMentor);
router.post("/:id/assign/trainer", authorize("super_admin", "admin"), courseController.assignTrainer);
router.delete("/:id/assign/trainer/:userId", authorize("super_admin", "admin"), courseController.unassignTrainer);
router.get("/user/:userId", courseController.getCoursesByUser);

module.exports = router;
