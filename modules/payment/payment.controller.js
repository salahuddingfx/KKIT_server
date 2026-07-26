const paymentService = require("./payment.service");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const ApiError = require("../../utils/apiError");

const getAllPayments = catchAsync(async (req, res) => {
  const options = { page: req.query.page, limit: req.query.limit };
  const query = { ...req.query };

  // Non-admin users can only see their own payments
  if (!["super_admin", "admin", "finance"].includes(req.user.role)) {
    query.user = req.user._id;
  }

  const result = await paymentService.getAllPayments(query, options);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getPaymentById = catchAsync(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  const isAdmin = ["super_admin", "admin", "finance"].includes(req.user.role);
  if (!isAdmin && payment.user._id.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden("Not authorized to view this payment");
  }
  ApiResponse.success(res, payment);
});

const createPayment = catchAsync(async (req, res) => {
  const isAdmin = ["super_admin", "admin", "finance"].includes(req.user.role);
  const payment = await paymentService.createPayment(
    { ...req.body, user: req.user._id },
    isAdmin
  );
  ApiResponse.created(res, payment);
});

const confirmPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.confirmPayment(req.params.id, req.user._id);
  ApiResponse.success(res, payment);
});

const cancelPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.cancelPayment(req.params.id, req.body.reason);
  ApiResponse.success(res, payment);
});

const refundPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.refundPayment(req.params.id, req.body.refundAmount);
  ApiResponse.success(res, payment);
});

const handleWebhook = catchAsync(async (req, res) => {
  const result = await paymentService.handleWebhook(req.params.provider, req.body);
  ApiResponse.success(res, result);
});

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  confirmPayment,
  cancelPayment,
  refundPayment,
  handleWebhook,
};
