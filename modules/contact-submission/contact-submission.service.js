const ContactSubmission = require("./contact-submission.model");
const { paginate } = require("../../utils/pagination");
const ApiError = require("../../utils/apiError");
const { trackServerLead } = require("../../services/tracking/tracking.service");

const create = async (data) => {
  const submission = await ContactSubmission.create(data);
  trackServerLead({
    leadType: data.subject?.includes("Job Application") ? "job_application" : "contact_form",
    subject: data.subject || "Contact Submission",
  }).catch((err) => console.error("Failed to track server lead:", err));
  return submission;
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
