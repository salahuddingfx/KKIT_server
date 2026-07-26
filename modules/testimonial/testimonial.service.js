const Testimonial = require("./testimonial.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getAllTestimonials = async (query, options) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.featured) filter.featured = query.featured === "true";
  return paginate(Testimonial, filter, { ...options, populate: "user course" });
};

const getTestimonialById = async (id) => {
  const testimonial = await Testimonial.findById(id);
  if (!testimonial) throw ApiError.notFound("Testimonial not found");
  return testimonial;
};

const createTestimonial = async (data) => {
  return Testimonial.create(data);
};

const updateTestimonial = async (id, data) => {
  const testimonial = await Testimonial.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!testimonial) throw ApiError.notFound("Testimonial not found");
  return testimonial;
};

const deleteTestimonial = async (id) => {
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) throw ApiError.notFound("Testimonial not found");
  return testimonial;
};

module.exports = { getAllTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial };
