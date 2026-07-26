const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const testimonialService = require("./testimonial.service");

const getAllTestimonials = catchAsync(async (req, res) => {
  const result = await testimonialService.getAllTestimonials(req.query, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const getTestimonialById = catchAsync(async (req, res) => {
  const testimonial = await testimonialService.getTestimonialById(req.params.id);
  ApiResponse.success(res, testimonial);
});

const createTestimonial = catchAsync(async (req, res) => {
  req.body.user = req.user._id;
  const testimonial = await testimonialService.createTestimonial(req.body);
  ApiResponse.created(res, testimonial);
});

const updateTestimonial = catchAsync(async (req, res) => {
  const testimonial = await testimonialService.updateTestimonial(req.params.id, req.body);
  ApiResponse.success(res, testimonial, "Testimonial updated");
});

const deleteTestimonial = catchAsync(async (req, res) => {
  await testimonialService.deleteTestimonial(req.params.id);
  ApiResponse.noContent(res);
});

module.exports = { getAllTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial };
