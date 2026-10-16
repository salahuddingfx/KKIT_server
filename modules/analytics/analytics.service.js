const User = require("../user/user.model");
const Course = require("../course/course.model");
const Enrollment = require("../enrollment/enrollment.model");
const Payment = require("../payment/payment.model");
const Progress = require("../progress/progress.model");

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalRevenue,
    recentUsers,
    activeEnrollments,
  ] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Payment.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt"),
    Enrollment.countDocuments({ status: "active" }),
  ]);

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalRevenue: totalRevenue[0]?.total || 0,
    recentUsers,
    activeEnrollments,
  };
};

const getUserMetrics = async ({ period = "30d" } = {}) => {
  const startDate = new Date();
  if (period === "7d") startDate.setDate(startDate.getDate() - 7);
  else if (period === "30d") startDate.setDate(startDate.getDate() - 30);
  else if (period === "90d") startDate.setDate(startDate.getDate() - 90);

  const [newUsers, activeUsers, usersByRole] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: startDate } }),
    User.countDocuments({ lastLogin: { $gte: startDate } }),
    User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  return { newUsers, activeUsers, usersByRole };
};

const getCourseMetrics = async () => {
  const [topCourses, coursesByCategory, avgRating] = await Promise.all([
    Course.find()
      .sort({ enrolledStudents: -1 })
      .limit(10)
      .select("title enrolledStudents rating"),
    Course.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Course.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating.average" } } },
    ]),
  ]);

  return {
    topCourses,
    coursesByCategory,
    avgRating: avgRating[0]?.avgRating || 0,
  };
};

const getRevenueMetrics = async ({ period = "30d" } = {}) => {
  const startDate = new Date();
  if (period === "7d") startDate.setDate(startDate.getDate() - 7);
  else if (period === "30d") startDate.setDate(startDate.getDate() - 30);
  else if (period === "90d") startDate.setDate(startDate.getDate() - 90);

  const [revenue, paymentsByMethod, revenueByCourse] = await Promise.all([
    Payment.aggregate([
      { $match: { status: "confirmed", createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Payment.aggregate([
      { $match: { status: "confirmed", createdAt: { $gte: startDate } } },
      { $group: { _id: "$method", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    Payment.aggregate([
      { $match: { status: "confirmed", createdAt: { $gte: startDate } } },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseData",
        },
      },
      { $unwind: "$courseData" },
      {
        $group: {
          _id: "$course",
          title: { $first: "$courseData.title" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]),
  ]);

  return { revenue, paymentsByMethod, revenueByCourse };
};

const getEngagementMetrics = async () => {
  const [completionRate, avgProgress, quizStats] = await Promise.all([
    Progress.aggregate([
      { $group: { _id: "$course", total: { $sum: 1 }, completed: { $sum: { $cond: ["$completed", 1, 0] } } } },
      { $group: { _id: null, avgCompletion: { $avg: { $divide: ["$completed", "$total"] } } } },
    ]),
    Progress.aggregate([
      { $group: { _id: { user: "$user", course: "$course" }, count: { $sum: 1 } } },
      { $group: { _id: null, avgLessonsPerUser: { $avg: "$count" } } },
    ]),
    null,
  ]);

  return {
    completionRate: completionRate[0]?.avgCompletion * 100 || 0,
    avgLessonsPerUser: avgProgress[0]?.avgLessonsPerUser || 0,
  };
};

module.exports = {
  getDashboardStats,
  getUserMetrics,
  getCourseMetrics,
  getRevenueMetrics,
  getEngagementMetrics,
};
