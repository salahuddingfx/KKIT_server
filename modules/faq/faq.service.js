const Faq = require("./faq.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getAllFaqs = async (query, options) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  return paginate(Faq, filter, options);
};

const getFaqById = async (id) => {
  const faq = await Faq.findById(id);
  if (!faq) throw ApiError.notFound("FAQ not found");
  return faq;
};

const createFaq = async (data) => {
  return Faq.create(data);
};

const updateFaq = async (id, data) => {
  const faq = await Faq.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!faq) throw ApiError.notFound("FAQ not found");
  return faq;
};

const deleteFaq = async (id) => {
  const faq = await Faq.findByIdAndDelete(id);
  if (!faq) throw ApiError.notFound("FAQ not found");
  return faq;
};

module.exports = { getAllFaqs, getFaqById, createFaq, updateFaq, deleteFaq };