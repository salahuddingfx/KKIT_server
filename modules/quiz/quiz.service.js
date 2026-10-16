const Quiz = require("./quiz.model");
const QuizAttempt = require("./quiz-attempt.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const createQuiz = async (data) => {
  return Quiz.create(data);
};

const getQuizById = async (id) => {
  const quiz = await Quiz.findById(id);
  if (!quiz) throw ApiError.notFound("Quiz not found");
  return quiz;
};

const getQuizzesByCourse = async (courseId) => {
  return Quiz.find({ course: courseId, status: "published" });
};

const updateQuiz = async (id, data) => {
  const quiz = await Quiz.findByIdAndUpdate(id, data, { new: true });
  if (!quiz) throw ApiError.notFound("Quiz not found");
  return quiz;
};

const deleteQuiz = async (id) => {
  const quiz = await Quiz.findByIdAndDelete(id);
  if (!quiz) throw ApiError.notFound("Quiz not found");
};

const submitAttempt = async (userId, quizId, { answers, timeSpent }) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw ApiError.notFound("Quiz not found");

  const attemptCount = await QuizAttempt.countDocuments({
    user: userId,
    quiz: quizId,
  });

  if (attemptCount >= quiz.maxAttempts) {
    throw ApiError.badRequest("Maximum attempts reached");
  }

  let score = 0;
  let totalPoints = 0;
  const gradedAnswers = answers.map((answer, index) => {
    const question = quiz.questions[index];
    if (!question) return { ...answer, isCorrect: false };

    totalPoints += question.points;
    const isCorrect =
      answer.answer.toLowerCase().trim() ===
      question.correctAnswer.toLowerCase().trim();

    if (isCorrect) score += question.points;

    return {
      questionIndex: index,
      answer: answer.answer,
      isCorrect,
    };
  });

  const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
  const passed = percentage >= quiz.passingScore;

  return QuizAttempt.create({
    user: userId,
    quiz: quizId,
    answers: gradedAnswers,
    score,
    totalPoints,
    passed,
    timeSpent: timeSpent || 0,
  });
};

const getUserAttempts = async (userId, quizId) => {
  return QuizAttempt.find({ user: userId, quiz: quizId }).sort({
    attemptedAt: -1,
  });
};

const getAllQuizzes = async (query, options) => {
  const filter = {};
  if (query.course) filter.course = query.course;
  return paginate(Quiz, filter, options);
};

module.exports = {
  createQuiz,
  getQuizById,
  getQuizzesByCourse,
  updateQuiz,
  deleteQuiz,
  submitAttempt,
  getUserAttempts,
  getAllQuizzes,
};
