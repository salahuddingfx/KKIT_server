const User = require("../user/user.model");
const Course = require("../course/course.model");
const Payment = require("../payment/payment.model");
const Enrollment = require("../enrollment/enrollment.model");
const Blog = require("../blog/blog.model");
const Notice = require("../notice/notice.model");
const ContactSubmission = require("../contact-submission/contact-submission.model");
const Subscriber = require("../subscriber/subscriber.model");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const { paginate } = require("../../utils/pagination");

// ─── DASHBOARD STATS ────────────────────────────────
const getStats = catchAsync(async (req, res) => {
  const [
    totalUsers,
    totalCourses,
    totalPublishedCourses,
    totalEnrollments,
    totalRevenue,
    totalBlogs,
    totalNotices,
    totalSubmissions,
    totalSubscribers,
  ] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Course.countDocuments({ status: "published" }),
    Enrollment.countDocuments(),
    Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Blog.countDocuments(),
    Notice.countDocuments(),
    ContactSubmission.countDocuments(),
    Subscriber.countDocuments({ status: "active" }),
  ]);

  const monthlyRevenue = await Payment.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        revenue: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 12 },
  ]);

  const usersByRole = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  const pendingPayments = await Payment.countDocuments({ status: "pending" });

  ApiResponse.success(res, {
    totalUsers,
    totalCourses,
    totalPublishedCourses,
    totalEnrollments,
    totalRevenue: totalRevenue[0]?.total || 0,
    totalBlogs,
    totalNotices,
    totalSubmissions,
    totalSubscribers,
    pendingPayments,
    monthlyRevenue,
    usersByRole,
  });
});

// ─── RECENT ACTIVITY ────────────────────────────────
const getRecent = catchAsync(async (req, res) => {
  const [recentUsers, recentEnrollments, recentPayments, recentSubmissions] = await Promise.all([
    User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt"),
    Enrollment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("course", "title"),
    Payment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .select("amount status method createdAt"),
    ContactSubmission.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email subject status createdAt"),
  ]);

  ApiResponse.success(res, {
    recentUsers,
    recentEnrollments,
    recentPayments,
    recentSubmissions,
  });
});

// ─── ALL USERS (admin) ──────────────────────────────
const getAllUsers = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true";
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];
  }
  const result = await paginate(User, filter, {
    page: req.query.page,
    limit: req.query.limit,
    sort: { createdAt: -1 },
  });
  ApiResponse.paginated(res, result.data, result.meta);
});

// ─── UPDATE USER STATUS ─────────────────────────────
const updateUserStatus = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: req.body.isActive, role: req.body.role },
    { new: true }
  );
  if (!user) return ApiResponse.error(res, "User not found", 404);
  ApiResponse.success(res, user);
});

// ─── OVERVIEW (compat) ──────────────────────────────
const getOverview = getStats;

// ─── REPORTS ────────────────────────────────────────
const getReports = catchAsync(async (req, res) => {
  const payments = await Payment.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: "$method", count: { $sum: 1 }, total: { $sum: "$amount" } } },
  ]);
  ApiResponse.success(res, { payments });
});

module.exports = {
  getStats,
  getRecent,
  getAllUsers,
  updateUserStatus,
  getOverview,
  getReports,
};
