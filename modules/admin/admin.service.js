const User = require("../user/user.model");
const Enrollment = require("../enrollment/enrollment.model");
const Payment = require("../payment/payment.model");
const Course = require("../course/course.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getOverview = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalUsers, activeUsers, newToday, totalRevenue] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ createdAt: { $gte: startOfDay } }),
    Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
    newToday,
    totalRevenue: totalRevenue[0]?.total || 0,
  };
};

const getAllUsers = async (query, options) => {
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }
  return paginate(User, filter, options);
};

const updateUserStatus = async (id, isActive) => {
  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
  if (!user) throw ApiError.notFound("User not found");
  return user;
};

const getReports = async () => {
  const [userStats, courseStats, enrollmentStats, paymentStats] = await Promise.all([
    User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]),
    Course.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Enrollment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Payment.aggregate([
      { $group: { _id: { status: "$status", method: "$method" }, count: { $sum: 1 }, total: { $sum: "$amount" } } },
    ]),
  ]);

  return { userStats, courseStats, enrollmentStats, paymentStats };
};

module.exports = { getOverview, getAllUsers, updateUserStatus, getReports };
