const User = require("../user/user.model");
const Submission = require("../submission/submission.model");

const calculateStreak = (loginHistory = []) => {
  if (!loginHistory.length) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDays = new Set(
    loginHistory.map((entry) => {
      const d = new Date(entry.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  let streak = 0;
  let checkDate = new Date(today);

  // If no login today, start checking from yesterday
  if (!uniqueDays.has(checkDate.getTime())) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (uniqueDays.has(checkDate.getTime())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
};

const getLeaderboard = async ({ limit = 50 } = {}) => {
  const users = await User.find({ role: "user", isActive: true })
    .select("name avatar enrolledCourses completedLessons createdAt loginHistory")
    .lean();

  const leaderboard = users.map((u) => {
    const coursesEnrolled = (u.enrolledCourses || []).length;
    const coursesCompleted = (u.enrolledCourses || []).filter((e) => e.status === "completed").length;
    const lessonsCompleted = (u.completedLessons || []).length;
    const points = coursesCompleted * 100 + lessonsCompleted * 10 + coursesEnrolled * 5;
    const streak = calculateStreak(u.loginHistory);

    return {
      _id: u._id,
      name: u.name,
      avatar: u.avatar,
      coursesEnrolled,
      coursesCompleted,
      lessonsCompleted,
      points,
      streak,
      joinedAt: u.createdAt,
    };
  });

  leaderboard.sort((a, b) => b.points - a.points);

  return leaderboard.slice(0, limit).map((u, i) => ({
    ...u,
    rank: i + 1,
  }));
};

const getMyStats = async (userId) => {
  const user = await User.findById(userId)
    .select("name avatar enrolledCourses completedLessons createdAt loginHistory")
    .lean();

  if (!user) return null;

  const coursesEnrolled = (user.enrolledCourses || []).length;
  const coursesCompleted = (user.enrolledCourses || []).filter((e) => e.status === "completed").length;
  const lessonsCompleted = (user.completedLessons || []).length;
  const points = coursesCompleted * 100 + lessonsCompleted * 10 + coursesEnrolled * 5;
  const streak = calculateStreak(user.loginHistory);

  const leaderboard = await getLeaderboard({ limit: 1000 });
  const rankEntry = leaderboard.find((e) => e._id.toString() === userId.toString());

  return {
    rank: rankEntry?.rank || leaderboard.length + 1,
    points,
    coursesEnrolled,
    coursesCompleted,
    lessonsCompleted,
    streak,
    weeklyRank: rankEntry?.rank || leaderboard.length + 1,
  };
};

module.exports = { getLeaderboard, getMyStats };
