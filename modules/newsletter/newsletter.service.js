const Newsletter = require("./newsletter.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");
const { sendEmail } = require("../../services/email/email.service");

const getAllSubscribers = async (query, options) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  return paginate(Newsletter, filter, options);
};

const subscribe = async (data) => {
  const existing = await Newsletter.findOne({ email: data.email });
  if (existing) {
    if (existing.status === "unsubscribed") {
      existing.status = "active";
      existing.unsubscribedAt = undefined;
      await existing.save();
      return existing;
    }
    throw ApiError.conflict("Already subscribed");
  }

  const subscriber = await Newsletter.create(data);

  sendEmail({
    to: data.email,
    subject: "Welcome to KKIT Newsletter!",
    template: "newsletter",
    data: { name: data.name || "Subscriber", unsubscribeUrl: "#" },
  }).catch(() => {});

  return subscriber;
};

const unsubscribe = async (id) => {
  const subscriber = await Newsletter.findByIdAndUpdate(
    id,
    { status: "unsubscribed", unsubscribedAt: new Date() },
    { new: true }
  );
  if (!subscriber) throw ApiError.notFound("Subscriber not found");
  return subscriber;
};

module.exports = { getAllSubscribers, subscribe, unsubscribe };
