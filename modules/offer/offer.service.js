const Offer = require("./offer.model");
const ApiError = require("../../utils/apiError");

const getAll = async (query = {}) => {
  const filter = {};
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";
  if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured === "true";
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { couponCode: { $regex: query.search, $options: "i" } },
    ];
  }
  return Offer.find(filter)
    .populate("courses", "title slug thumbnail price discountPrice category")
    .sort({ priority: -1, createdAt: -1 });
};

const getById = async (id) => {
  const offer = await Offer.findById(id).populate(
    "courses",
    "title slug thumbnail price discountPrice category enrolledStudents rating"
  );
  if (!offer) throw ApiError.notFound("Offer not found");
  return offer;
};

const getBySlug = async (slug) => {
  const offer = await Offer.findOne({ slug, isActive: true }).populate(
    "courses",
    "title slug thumbnail price discountPrice category enrolledStudents rating"
  );
  if (!offer) throw ApiError.notFound("Offer not found");
  return offer;
};

const getActive = async () => {
  const now = new Date();
  return Offer.find({
    isActive: true,
    startDate: { $lte: now },
    $or: [{ endDate: { $gte: now } }, { endDate: { $exists: false } }],
  })
    .populate("courses", "title slug thumbnail price discountPrice category rating")
    .sort({ priority: -1, createdAt: -1 });
};

const create = async (data) => {
  return Offer.create(data);
};

const update = async (id, data) => {
  const offer = await Offer.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!offer) throw ApiError.notFound("Offer not found");
  return offer;
};

const remove = async (id) => {
  const offer = await Offer.findByIdAndDelete(id);
  if (!offer) throw ApiError.notFound("Offer not found");
  return offer;
};

const validateCoupon = async (code) => {
  const now = new Date();
  const offer = await Offer.findOne({
    couponCode: code.toUpperCase(),
    isActive: true,
    startDate: { $lte: now },
    $or: [{ endDate: { $gte: now } }, { endDate: { $exists: false } }],
  }).populate("courses", "title price discountPrice");

  if (!offer) throw ApiError.notFound("Invalid or expired coupon code");
  if (offer.usageLimit > 0 && offer.usedCount >= offer.usageLimit) {
    throw ApiError.badRequest("Coupon usage limit reached");
  }
  return offer;
};

module.exports = { getAll, getById, getBySlug, getActive, create, update, remove, validateCoupon };
