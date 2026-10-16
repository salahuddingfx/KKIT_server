const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const quizService = require("./quiz.service");

const createQuiz = catchAsync(async (req, res) => {
  const quiz = await quizService.createQuiz(req.body);
  ApiResponse.created(res, quiz, "Quiz created");
});

const getQuizById = catchAsync(async (req, res) => {
  const quiz = await quizService.getQuizById(req.params.id);
  ApiResponse.success(res, quiz);
});

const getQuizzesByCourse = catchAsync(async (req, res) => {
  const quizzes = await quizService.getQuizzesByCourse(req.params.courseId);
  ApiResponse.success(res, quizzes);
});

const updateQuiz = catchAsync(async (req, res) => {
  const quiz = await quizService.updateQuiz(req.params.id, req.body);
  ApiResponse.success(res, quiz, "Quiz updated");
});

const deleteQuiz = catchAsync(async (req, res) => {
  await quizService.deleteQuiz(req.params.id);
  ApiResponse.noContent(res);
});

const submitAttempt = catchAsync(async (req, res) => {
  const attempt = await quizService.submitAttempt(req.user._id, req.params.id, req.body);
  ApiResponse.created(res, attempt, "Quiz submitted");
});

const getUserAttempts = catchAsync(async (req, res) => {
  const attempts = await quizService.getUserAttempts(req.user._id, req.params.id);
  ApiResponse.success(res, attempts);
});

const getAllQuizzes = catchAsync(async (req, res) => {
  const result = await quizService.getAllQuizzes(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

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
