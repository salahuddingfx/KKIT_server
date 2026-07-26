const User = require("../user/user.model");
const Course = require("../course/course.model");
const Enrollment = require("../enrollment/enrollment.model");
const Payment = require("../payment/payment.model");

const getStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    revenueResult,
    newUsersThisMonth,
    newEnrollmentsThisMonth,
    revenueThisMonth,
    recentEnrollments,
    topCourses,
    topInstructors,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Course.countDocuments({ status: "published" }),
    Enrollment.countDocuments(),
    Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Enrollment.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Payment.aggregate([
      { $match: { status: "completed", createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Enrollment.find()
      .sort("-createdAt")
      .limit(10)
      .populate("user", "name email")
      .populate("course", "title")
      .lean(),
    Course.find({ status: "published" })
      .sort("-enrolledStudents")
      .limit(5)
      .select("title enrolledStudents rating")
      .lean(),
    User.aggregate([
      { $match: { role: { $in: ["mentor", "trainer"] } } },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "instructor",
          as: "courses",
        },
      },
      {
        $project: {
          name: 1,
          courseCount: { $size: "$courses" },
        },
      },
      { $sort: { courseCount: -1 } },
      { $limit: 5 },
    ]),
  ]);

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalRevenue: revenueResult[0]?.total || 0,
    newUsersThisMonth,
    newEnrollmentsThisMonth,
    revenueThisMonth: revenueThisMonth[0]?.total || 0,
    recentEnrollments,
    topCourses,
    topInstructors,
  };
};

const getEnrollmentChart = async () => {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: date.toLocaleString("default", { month: "short", year: "numeric" }),
      start: date,
      end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    });
  }

  const chart = await Promise.all(
    months.map(async (m) => {
      const count = await Enrollment.countDocuments({
        createdAt: { $gte: m.start, $lte: m.end },
      });
      return { month: m.month, count };
    })
  );

  return chart;
};

const getRevenueChart = async () => {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: date.toLocaleString("default", { month: "short", year: "numeric" }),
      start: date,
      end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    });
  }

  const chart = await Promise.all(
    months.map(async (m) => {
      const result = await Payment.aggregate([
        { $match: { status: "completed", createdAt: { $gte: m.start, $lte: m.end } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      return { month: m.month, total: result[0]?.total || 0 };
    })
  );

  return chart;
};

const getRecentActivity = async () => {
  const [recentEnrollments, recentPayments, recentUsers] = await Promise.all([
    Enrollment.find().sort("-createdAt").limit(5).populate("user", "name").populate("course", "title").lean(),
    Payment.find().sort("-createdAt").limit(5).populate("user", "name").lean(),
    User.find().sort("-createdAt").limit(5).select("name email role createdAt").lean(),
  ]);

  return { recentEnrollments, recentPayments, recentUsers };
};

module.exports = { getStats, getEnrollmentChart, getRevenueChart, getRecentActivity };
