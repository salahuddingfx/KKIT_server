const Subscriber = require("./subscriber.model");
const { paginate } = require("../../utils/pagination");
const ApiError = require("../../utils/apiError");

const subscribe = async (email, name, source = "website") => {
  const existing = await Subscriber.findOne({ email });
  if (existing) {
    if (existing.status === "unsubscribed") {
      existing.status = "active";
      await existing.save();
    }
    return existing;
  }
  return Subscriber.create({ email, name, source });
};

const getAll = async (query, options) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.search) filter.email = { $regex: query.search, $options: "i" };
  return paginate(Subscriber, filter, { ...options, sort: { createdAt: -1 } });
};

const unsubscribe = async (email) => {
  const sub = await Subscriber.findOneAndUpdate(
    { email },
    { status: "unsubscribed" },
    { new: true }
  );
  if (!sub) throw ApiError.notFound("Subscriber not found");
  return sub;
};

const remove = async (id) => {
  const sub = await Subscriber.findByIdAndDelete(id);
  if (!sub) throw ApiError.notFound("Subscriber not found");
  return sub;
};

const exportAll = async () => {
  return Subscriber.find({ status: "active" }).select("email name createdAt");
};

module.exports = { subscribe, getAll, unsubscribe, remove, exportAll };
