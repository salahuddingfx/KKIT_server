const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const installmentService = require("./installment.service");

const createPlan = catchAsync(async (req, res) => {
  const installment = await installmentService.createInstallmentPlan(req.user._id, req.body);
  ApiResponse.created(res, installment, "Installment plan created");
});

const payInstallment = catchAsync(async (req, res) => {
  const { id, installmentNumber } = req.params;
  const installment = await installmentService.payInstallment(
    id,
    parseInt(installmentNumber),
    req.body
  );
  ApiResponse.success(res, installment, "Installment paid successfully");
});

const getMyInstallments = catchAsync(async (req, res) => {
  const installments = await installmentService.getUserInstallments(req.user._id);
  ApiResponse.success(res, installments);
});

const getInstallmentById = catchAsync(async (req, res) => {
  const installment = await installmentService.getInstallmentById(req.params.id, req.user._id);
  ApiResponse.success(res, installment);
});

module.exports = {
  createPlan,
  payInstallment,
  getMyInstallments,
  getInstallmentById,
};
