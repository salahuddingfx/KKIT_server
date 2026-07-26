const Payment = require("../payment/payment.model");
const User = require("../user/user.model");
const Course = require("../course/course.model");
const Enrollment = require("../enrollment/enrollment.model");

const getRevenueSummary = async (period = "monthly") => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const [totalResult, thisMonthResult, lastMonthResult, avgResult] =
    await Promise.all([
      Payment.aggregate([
        { $match: { status: { $in: ["completed", "confirmed"] } } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Payment.aggregate([
        { $match: { status: { $in: ["completed", "confirmed"] }, createdAt: { $gte: startOfThisMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Payment.aggregate([
        {
          $match: {
            status: { $in: ["completed", "confirmed"] },
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Payment.aggregate([
        { $match: { status: { $in: ["completed", "confirmed"] } } },
        { $group: { _id: null, avg: { $avg: "$amount" } } },
      ]),
    ]);

  const totalRevenue = totalResult[0]?.total || 0;
  const thisMonthRevenue = thisMonthResult[0]?.total || 0;
  const lastMonthRevenue = lastMonthResult[0]?.total || 0;
  const averageOrderValue = avgResult[0]?.avg || 0;

  const growth =
    lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : thisMonthRevenue > 0
        ? 100
        : 0;

  return {
    totalRevenue,
    thisMonthRevenue,
    lastMonthRevenue,
    growth: Math.round(growth * 100) / 100,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
  };
};

const getRevenueByMonth = async (months = 12) => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

  const results = await Payment.aggregate([
    { $match: { status: { $in: ["completed", "confirmed"] }, createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        revenue: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return results.map((r) => ({
    month: `${monthNames[r._id.month - 1]} ${r._id.year}`,
    revenue: r.revenue,
    count: r.count,
  }));
};

const getRevenueByCourse = async () => {
  const results = await Payment.aggregate([
    { $match: { status: { $in: ["completed", "confirmed"] } } },
    {
      $group: {
        _id: "$course",
        revenue: { $sum: "$amount" },
        enrollments: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "courseInfo",
      },
    },
    { $unwind: { path: "$courseInfo", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        course: "$courseInfo.title",
        revenue: 1,
        enrollments: 1,
      },
    },
  ]);

  return results;
};

const getRevenueByMethod = async () => {
  const results = await Payment.aggregate([
    { $match: { status: { $in: ["completed", "confirmed"] } } },
    {
      $group: {
        _id: "$method",
        count: { $sum: 1 },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { total: -1 } },
    {
      $project: {
        _id: 0,
        method: "$_id",
        count: 1,
        total: 1,
      },
    },
  ]);

  return results;
};

const getDashboardStats = async () => {
  const [totalUsers, totalCourses, totalEnrollments, totalRevenueResult] =
    await Promise.all([
      User.countDocuments({ isActive: true }),
      Course.countDocuments({ isPublished: true }),
      Enrollment.countDocuments({ status: { $in: ["active", "completed"] } }),
      Payment.aggregate([
        { $match: { status: { $in: ["completed", "confirmed"] } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

  const totalRevenue = totalRevenueResult[0]?.total || 0;

  const [recentPayments, popularCourses] = await Promise.all([
    Payment.find({ status: { $in: ["completed", "confirmed"] } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .populate("course", "title")
      .lean(),
    Enrollment.aggregate([
      { $match: { status: { $in: ["active", "completed"] } } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      { $unwind: { path: "$courseInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          course: "$courseInfo.title",
          enrollments: "$count",
        },
      },
    ]),
  ]);

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalRevenue,
    recentPayments,
    popularCourses,
  };
};

const getConversionFunnel = async () => {
  const [totalRegistered, totalEnrolled, totalCompleted, revenueResult] =
    await Promise.all([
      User.countDocuments({ isActive: true }),
      Enrollment.countDocuments({ status: { $in: ["active", "completed"] } }),
      Enrollment.countDocuments({ status: "completed" }),
      Payment.aggregate([
        { $match: { status: { $in: ["completed", "confirmed"] } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

  return {
    totalVisits: totalRegistered,
    enrolled: totalEnrolled,
    completed: totalCompleted,
    revenue: revenueResult[0]?.total || 0,
  };
};

const getTopCourses = async (limit = 5) => {
  const results = await Enrollment.aggregate([
    { $match: { status: { $in: ["active", "completed"] } } },
    { $group: { _id: "$course", enrollments: { $sum: 1 } } },
    { $sort: { enrollments: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "courseInfo",
      },
    },
    { $unwind: { path: "$courseInfo", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "payments",
        let: { courseId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$course", "$$courseId"] },
                  { $in: ["$status", ["completed", "confirmed"]] },
                ],
              },
            },
          },
          { $group: { _id: null, revenue: { $sum: "$amount" } } },
        ],
        as: "revenueData",
      },
    },
    {
      $project: {
        _id: 0,
        course: "$courseInfo.title",
        enrollments: 1,
        revenue: {
          $ifNull: [{ $arrayElemAt: ["$revenueData.revenue", 0] }, 0],
        },
      },
    },
  ]);

  return results;
};

const getRevenueGrowth = async () => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const [thisMonthResult, lastMonthResult] = await Promise.all([
    Payment.aggregate([
      { $match: { status: { $in: ["completed", "confirmed"] }, createdAt: { $gte: startOfThisMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Payment.aggregate([
      {
        $match: {
          status: { $in: ["completed", "confirmed"] },
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const thisMonth = thisMonthResult[0]?.total || 0;
  const lastMonth = lastMonthResult[0]?.total || 0;
  const growth =
    lastMonth > 0
      ? ((thisMonth - lastMonth) / lastMonth) * 100
      : thisMonth > 0
        ? 100
        : 0;

  return {
    thisMonth,
    lastMonth,
    growth: Math.round(growth * 100) / 100,
  };
};

const getRevenueByCategory = async () => {
  const results = await Payment.aggregate([
    { $match: { status: { $in: ["completed", "confirmed"] } } },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "courseInfo",
      },
    },
    { $unwind: { path: "$courseInfo", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ["$courseInfo.category", "General"] },
        revenue: { $sum: "$amount" },
        enrollments: { $sum: 1 },
        courseIds: { $addToSet: "$course" },
      },
    },
    { $sort: { revenue: -1 } },
    {
      $project: {
        _id: 0,
        category: "$_id",
        revenue: 1,
        enrollments: 1,
        courseCount: { $size: "$courseIds" },
      },
    },
  ]);

  return results;
};

module.exports = {
  getRevenueSummary,
  getRevenueByMonth,
  getRevenueByCourse,
  getRevenueByCategory,
  getRevenueByMethod,
  getDashboardStats,
  getConversionFunnel,
  getTopCourses,
  getRevenueGrowth,
};
