const express = require("express");
const router = express.Router();
const progressController = require("./progress.controller");
const { protect } = require("../../middleware/auth");

router.use(protect);

router.get("/dashboard", progressController.getUserCoursesProgress);
router.get("/:courseId", progressController.getCourseProgress);
router.post("/:courseId/:lessonId/complete", progressController.markComplete);
router.put("/:courseId/:lessonId", progressController.updateLessonProgress);
router.delete("/:courseId/:lessonId", progressController.deleteLessonProgress);

module.exports = router;
