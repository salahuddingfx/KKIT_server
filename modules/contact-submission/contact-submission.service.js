const ContactSubmission = require("./contact-submission.model");
const { paginate } = require("../../utils/pagination");
const ApiError = require("../../utils/apiError");

const create = async (data) => {
  return ContactSubmission.create(data);
};

const getAll = async (query, options) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { subject: { $regex: query.search, $options: "i" } },
    ];
  }
  return paginate(ContactSubmission, filter, { ...options, sort: { createdAt: -1 } });
};

const getById = async (id) => {
  const item = await ContactSubmission.findById(id);
  if (!item) throw ApiError.notFound("Submission not found");
  return item;
};

const markAs = async (id, status, userId) => {
  const item = await ContactSubmission.findByIdAndUpdate(
    id,
    { status, ...(status === "replied" ? { repliedAt: new Date(), repliedBy: userId } : {}) },
    { new: true }
  );
  if (!item) throw ApiError.notFound("Submission not found");
  return item;
};

const remove = async (id) => {
  const item = await ContactSubmission.findByIdAndDelete(id);
  if (!item) throw ApiError.notFound("Submission not found");
  return item;
};

module.exports = { create, getAll, getById, markAs, remove };
