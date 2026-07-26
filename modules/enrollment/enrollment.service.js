const Enrollment = require("./enrollment.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");
const { emitEvent } = require("../gamification/gamification.service");

const getAllEnrollments = async (query, options) => {
  const filter = {};
  if (query.user) filter.user = query.user;
  if (query.course) filter.course = query.course;
  if (query.status) filter.status = query.status;
  return paginate(Enrollment, filter, { ...options, populate: "user course" });
};

const getEnrollmentById = async (id) => {
  const enrollment = await Enrollment.findById(id).populate("user", "name email").populate("course", "title slug");
  if (!enrollment) throw ApiError.notFound("Enrollment not found");
  return enrollment;
};

const updateEnrollmentStatus = async (id, status) => {
  const enrollment = await Enrollment.findByIdAndUpdate(id, { status }, { new: true });
  if (!enrollment) throw ApiError.notFound("Enrollment not found");
  return enrollment;
};

const markComplete = async (id) => {
  const enrollment = await Enrollment.findById(id);
  if (!enrollment) throw ApiError.notFound("Enrollment not found");
  enrollment.status = "completed";
  enrollment.completedAt = new Date();
  await enrollment.save();
  emitEvent("course_complete", { userId: enrollment.user.toString(), courseId: enrollment.course.toString() });
  return enrollment;
};

const toggleLessonComplete = async (enrollmentId, lessonId, userId) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) throw ApiError.notFound("Enrollment not found");

  const User = require("../user/user.model");
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");

  const courseId = enrollment.course;
  const existingIdx = user.completedLessons.findIndex(
    (cl) => cl.course.toString() === courseId.toString() && cl.lesson.toString() === lessonId.toString()
  );

  let completed;
  if (existingIdx > -1) {
    user.completedLessons.splice(existingIdx, 1);
    completed = false;
  } else {
    user.completedLessons.push({ course: courseId, lesson: lessonId });
    completed = true;
  }
  await user.save();

  const totalLessons = enrollment.progress?.totalLessons || 1;
  const completedCount = user.completedLessons.filter(
    (cl) => cl.course.toString() === courseId.toString()
  ).length;
  enrollment.progress.completedLessons = completedCount;
  enrollment.progress.percentage = Math.round((completedCount / totalLessons) * 100);
  await enrollment.save();

  if (completed) {
    emitEvent("lesson_complete", { userId: userId.toString(), courseId: courseId.toString() });
  }

  return { completed, completedCount, percentage: enrollment.progress.percentage };
};

const FALLBACK_ENROLLMENTS = [
  { name: "Sarah K.", city: "Dhaka", course: "Full-Stack Web Development" },
  { name: "Rahim M.", city: "Chittagong", course: "React & Next.js Masterclass" },
  { name: "Nusrat J.", city: "Sylhet", course: "UI/UX Product Design" },
  { name: "Tanvir A.", city: "Rajshahi", course: "Python & Data Science" },
  { name: "Fatima Z.", city: "Khulna", course: "Mobile App Development" },
  { name: "Arif H.", city: "Comilla", course: "Node.js & Microservices" },
];

const getRecentPublicEnrollments = async (limit = 8) => {
  try {
    const list = await Enrollment.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "name address")
      .populate("course", "title");

    const realEnrollments = list
      .filter((e) => e.course && e.user)
      .map((e) => {
        const fullName = e.user?.name || "Student";
        const parts = fullName.trim().split(" ");
        const maskedName = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1].charAt(0)}.` : fullName;

        let city = "Dhaka";
        if (e.user?.address) {
          if (typeof e.user.address === "string" && e.user.address.trim()) {
            city = e.user.address.trim();
          } else if (e.user.address.city && e.user.address.city.trim()) {
            city = e.user.address.city.trim();
          }
        }

        return {
          id: e._id.toString(),
          name: maskedName,
          city,
          course: e.course?.title || "KKIT Course",
          createdAt: e.createdAt,
        };
      });

    if (realEnrollments.length >= 3) {
      return realEnrollments;
    }

    return [...realEnrollments, ...FALLBACK_ENROLLMENTS.slice(0, limit - realEnrollments.length)];
  } catch (err) {
    return FALLBACK_ENROLLMENTS;
  }
};

module.exports = {
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollmentStatus,
  markComplete,
  toggleLessonComplete,
  getRecentPublicEnrollments,
};
