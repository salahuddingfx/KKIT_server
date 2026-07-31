const Career = require("./career.model");
const { slugify } = require("../../utils/helpers");
const { paginate } = require("../../utils/pagination");
const ApiError = require("../../utils/apiError");

const ContactSubmission = require("../contact-submission/contact-submission.model");

const getAll = async (query, options) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.department) filter.department = query.department;
  if (query.type) filter.type = query.type;
  if (query.search) filter.$text = { $search: query.search };
  return paginate(Career, filter, { ...options, sort: { order: 1, createdAt: -1 } });
};

const getById = async (id) => {
  const item = await Career.findById(id);
  if (!item) throw ApiError.notFound("Career not found");
  return item;
};

const create = async (data) => {
  data.slug = slugify(data.title);
  return Career.create(data);
};

const update = async (id, data) => {
  if (data.title) data.slug = slugify(data.title);
  const item = await Career.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!item) throw ApiError.notFound("Career not found");
  return item;
};

const remove = async (id) => {
  const item = await Career.findByIdAndDelete(id);
  if (!item) throw ApiError.notFound("Career not found");
  return item;
};

const apply = async (id, data) => {
  const career = await Career.findById(id);
  if (!career) throw ApiError.notFound("Job opening not found");
  if (career.status !== "active") throw ApiError.badRequest("This job opening is no longer active");

  const message = `Candidate Application for ${career.title} (${career.department})
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "N/A"}
Experience: ${data.experience || "N/A"}
Resume / Portfolio URL: ${data.resumeUrl || "N/A"}

Cover Letter / Note:
${data.coverLetter || "N/A"}`;

  return ContactSubmission.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: `Job Application: ${career.title}`,
    message,
    status: "new",
  });
};

module.exports = { getAll, getById, create, update, remove, apply };

