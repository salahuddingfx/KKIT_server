const express = require("express");
const router = express.Router();
const quizController = require("./quiz.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.get("/course/:courseId", quizController.getQuizzesByCourse);

router.use(protect);

router.get("/", quizController.getAllQuizzes);
router.get("/:id", quizController.getQuizById);
router.post("/:id/submit", quizController.submitAttempt);
router.get("/:id/attempts", quizController.getUserAttempts);

router.post("/", authorize("super_admin", "admin", "mentor", "trainer"), quizController.createQuiz);
router.put("/:id", authorize("super_admin", "admin", "mentor", "trainer"), quizController.updateQuiz);
router.delete("/:id", authorize("super_admin", "admin", "mentor", "trainer"), quizController.deleteQuiz);

module.exports = router;
