const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const faqService = require("./faq.service");

const getAllFaqs = catchAsync(async (req, res) => {
  const result = await faqService.getAllFaqs(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getFaqById = catchAsync(async (req, res) => {
  const faq = await faqService.getFaqById(req.params.id);
  ApiResponse.success(res, faq);
});

const createFaq = catchAsync(async (req, res) => {
  const faq = await faqService.createFaq(req.body);
  ApiResponse.created(res, faq);
});

const updateFaq = catchAsync(async (req, res) => {
  const faq = await faqService.updateFaq(req.params.id, req.body);
  ApiResponse.success(res, faq, "FAQ updated");
});

const deleteFaq = catchAsync(async (req, res) => {
  await faqService.deleteFaq(req.params.id);
  ApiResponse.noContent(res);
});

module.exports = { getAllFaqs, getFaqById, createFaq, updateFaq, deleteFaq };