const Progress = require("./progress.model");
const Course = require("../course/course.model");
const ApiError = require("../../utils/apiError");

const markLessonComplete = async (userId, courseId, lessonId) => {
  const existing = await Progress.findOne({
    user: userId,
    course: courseId,
    lesson: lessonId,
  });

  if (existing) {
    existing.completed = true;
    existing.completedAt = new Date();
    await existing.save();
    return existing;
  }

  return Progress.create({
    user: userId,
    course: courseId,
    lesson: lessonId,
    completed: true,
    completedAt: new Date(),
  });
};

const updateProgress = async (userId, courseId, lessonId, { watchTime, lastPosition }) => {
  const existing = await Progress.findOne({
    user: userId,
    course: courseId,
    lesson: lessonId,
  });

  if (existing) {
    if (watchTime !== undefined) existing.watchTime = watchTime;
    if (lastPosition !== undefined) existing.lastPosition = lastPosition;
    await existing.save();
    return existing;
  }

  return Progress.create({
    user: userId,
    course: courseId,
    lesson: lessonId,
    watchTime: watchTime || 0,
    lastPosition: lastPosition || 0,
  });
};

const getCourseProgress = async (userId, courseId) => {
  const progress = await Progress.find({
    user: userId,
    course: courseId,
  }).lean();

  const completedLessons = progress.filter((p) => p.completed).length;

  const totalLessons = await Course.findById(courseId).select("totalLessons").lean();
  const total = totalLessons?.totalLessons || 1;
  const percentage = Math.round((completedLessons / total) * 100);

  return {
    completedLessons,
    totalLessons: total,
    percentage,
    lessons: progress,
  };
};

const getUserCoursesProgress = async (userId) => {
  const userProgress = await Progress.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: "$course",
        totalLessons: { $sum: 1 },
        completedLessons: {
          $sum: { $cond: ["$completed", 1, 0] },
        },
        lastAccessed: { $max: "$updatedAt" },
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    { $unwind: "$course" },
    {
      $project: {
        _id: 1,
        course: {
          _id: "$course._id",
          title: "$course.title",
          slug: "$course.slug",
          thumbnail: "$course.thumbnail",
          totalLessons: "$course.totalLessons",
        },
        completedLessons: 1,
        totalLessons: "$course.totalLessons",
        percentage: {
          $multiply: [
            { $divide: ["$completedLessons", "$course.totalLessons"] },
            100,
          ],
        },
        lastAccessed: 1,
      },
    },
    { $sort: { lastAccessed: -1 } },
  ]);

  return userProgress;
};

const deleteProgress = async (userId, courseId, lessonId) => {
  return Progress.findOneAndDelete({
    user: userId,
    course: courseId,
    lesson: lessonId,
  });
};

module.exports = {
  markLessonComplete,
  updateProgress,
  getCourseProgress,
  getUserCoursesProgress,
  deleteProgress,
};
