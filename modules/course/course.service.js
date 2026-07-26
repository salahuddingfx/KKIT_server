const mongoose = require("mongoose");
const Course = require("./course.model");
const Category = require("../category/category.model");
const User = require("../user/user.model");
const DownloadRequest = require("../download-request/download-request.model");
const CourseOutlineRequest = require("../course-outline/course-outline.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");
const { sendEmail } = require("../../services/email/email.service");

const resolveCategoryId = async (categoryValue) => {
  if (!categoryValue) return null;
  if (mongoose.Types.ObjectId.isValid(categoryValue)) return categoryValue;
  const cat = await Category.findOne({
    $or: [{ name: categoryValue }, { slug: categoryValue }],
  });
  return cat ? cat._id : null;
};

const getAllCourses = async (query, options) => {
  const filter = {};
  if (query.category) {
    const categoryId = await resolveCategoryId(query.category);
    if (categoryId) filter.category = categoryId;
  }
  if (query.level) filter.level = query.level;
  if (query.status) filter.status = query.status;
  if (query.instructor) filter.instructor = query.instructor;
  if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured === "true";
  if (query.slug) filter.slug = query.slug;
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }
  try {
    return await paginate(Course, filter, { ...options, populate: "instructor category mentors.user trainers.user" });
  } catch (err) {
    if (err.name === "CastError") {
      return await paginate(Course, filter, { ...options, populate: "instructor mentors.user trainers.user" });
    }
    throw err;
  }
};

const getCourseById = async (id) => {
  let course;
  try {
    course = await Course.findById(id).populate("instructor", "name email avatar designation").populate("mentors.user", "name email avatar designation").populate("trainers.user", "name email avatar designation").populate("category");
  } catch (err) {
    if (err.name === "CastError") {
      course = await Course.findById(id).populate("instructor", "name email avatar designation").populate("mentors.user", "name email avatar designation").populate("trainers.user", "name email avatar designation");
    } else {
      throw err;
    }
  }
  if (!course) throw ApiError.notFound("Course not found");
  return course;
};

const getCourseBySlug = async (slug) => {
  let course;
  try {
    course = await Course.findOne({ slug }).populate("instructor", "name email avatar designation").populate("mentors.user", "name email avatar designation").populate("trainers.user", "name email avatar designation").populate("category");
  } catch (err) {
    if (err.name === "CastError") {
      course = await Course.findOne({ slug }).populate("instructor", "name email avatar designation").populate("mentors.user", "name email avatar designation").populate("trainers.user", "name email avatar designation");
    } else {
      throw err;
    }
  }
  if (!course) throw ApiError.notFound("Course not found");
  return course;
};

const createCourse = async (data) => {
  return Course.create(data);
};

const updateCourse = async (id, data) => {
  const course = await Course.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!course) throw ApiError.notFound("Course not found");
  return course;
};

const deleteCourse = async (id) => {
  const course = await Course.findByIdAndDelete(id);
  if (!course) throw ApiError.notFound("Course not found");
  return course;
};

const enrollInCourse = async (courseId, userId) => {
  const course = await Course.findById(courseId);
  if (!course) throw ApiError.notFound("Course not found");

  const user = await User.findById(userId);
  const alreadyEnrolled = user.enrolledCourses.some(
    (e) => e.course.toString() === courseId && e.status !== "cancelled"
  );
  if (alreadyEnrolled) throw ApiError.conflict("Already enrolled in this course");

  user.enrolledCourses.push({ course: courseId, status: "active" });
  await user.save();

  course.enrolledStudents += 1;
  await course.save();

  return course;
};

const assignMentor = async (courseId, userId) => {
  const course = await Course.findById(courseId);
  if (!course) throw ApiError.notFound("Course not found");

  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  if (!["mentor", "super_admin", "admin", "ceo", "md"].includes(user.role)) {
    throw ApiError.badRequest("User must be a mentor or admin");
  }

  const alreadyAssigned = course.mentors.some((m) => m.user.toString() === userId);
  if (alreadyAssigned) throw ApiError.conflict("User already assigned as mentor");

  course.mentors.push({ user: userId });
  await course.save();
  return course;
};

const unassignMentor = async (courseId, userId) => {
  const course = await Course.findById(courseId);
  if (!course) throw ApiError.notFound("Course not found");

  course.mentors = course.mentors.filter((m) => m.user.toString() !== userId);
  await course.save();
  return course;
};

const assignTrainer = async (courseId, userId) => {
  const course = await Course.findById(courseId);
  if (!course) throw ApiError.notFound("Course not found");

  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  if (!["trainer", "super_admin", "admin", "ceo", "md"].includes(user.role)) {
    throw ApiError.badRequest("User must be a trainer or admin");
  }

  const alreadyAssigned = course.trainers.some((t) => t.user.toString() === userId);
  if (alreadyAssigned) throw ApiError.conflict("User already assigned as trainer");

  course.trainers.push({ user: userId });
  await course.save();
  return course;
};

const unassignTrainer = async (courseId, userId) => {
  const course = await Course.findById(courseId);
  if (!course) throw ApiError.notFound("Course not found");

  course.trainers = course.trainers.filter((t) => t.user.toString() !== userId);
  await course.save();
  return course;
};

const getCoursesByUser = async (userId) => {
  const courses = await Course.find({
    $or: [
      { instructor: userId },
      { "mentors.user": userId },
      { "trainers.user": userId },
    ],
  }).populate("instructor", "name email avatar")
    .populate("mentors.user", "name email avatar")
    .populate("trainers.user", "name email avatar");
  return courses;
};

const requestModuleDownload = async (courseId, moduleId, data) => {
  const course = await Course.findById(courseId);
  if (!course) throw ApiError.notFound("Course not found");

  let foundModule = null;
  for (const mod of course.modules) {
    if (mod._id.toString() === moduleId) {
      foundModule = mod;
      break;
    }
  }
  if (!foundModule) throw ApiError.notFound("Module not found");

  await DownloadRequest.create({
    course: courseId,
    module: moduleId,
    moduleName: foundModule.title,
    courseName: course.title,
    name: data.name,
    email: data.email,
    phone: data.phone,
    whatsapp: data.whatsapp || "",
  });

  sendEmail({
    to: data.email,
    subject: `Module Download: ${foundModule.title} - ${course.title}`,
    template: "moduleDownload",
    data: {
      name: data.name,
      courseName: course.title,
      moduleName: foundModule.title,
      moduleDescription: foundModule.description || "",
      lessons: foundModule.lessons,
    },
  }).catch(() => {});

  sendEmail({
    to: process.env.FROM_EMAIL || "info@kkitbd.com",
    subject: `New Module Download Request: ${foundModule.title}`,
    template: "moduleDownloadAdmin",
    data: {
      studentName: data.name,
      studentEmail: data.email,
      studentPhone: data.phone,
      whatsapp: data.whatsapp || "N/A",
      courseName: course.title,
      moduleName: foundModule.title,
    },
  }).catch(() => {});

  return { message: "Module PDF will be sent to your email shortly" };
};

const requestCourseOutline = async (courseId, data) => {
  const course = await Course.findById(courseId);
  if (!course) throw ApiError.notFound("Course not found");

  await CourseOutlineRequest.create({
    course: courseId,
    courseName: course.title,
    name: data.name,
    email: data.email,
    phone: data.phone,
    whatsapp: data.whatsapp || "",
  });

  // Build curriculum text
  let curriculumText = "";
  let lessonCount = 0;
  course.modules.forEach((mod, idx) => {
    curriculumText += `\nModule ${idx + 1}: ${mod.title}\n`;
    if (mod.description) curriculumText += `  ${mod.description}\n`;
    mod.lessons.forEach((lesson) => {
      lessonCount++;
      curriculumText += `  - ${lesson.title}${lesson.duration ? ` (${lesson.duration} min)` : ""}\n`;
    });
  });

  // Send outline email to student
  sendEmail({
    to: data.email,
    subject: `Course Outline: ${course.title}`,
    template: "courseOutline",
    data: {
      name: data.name,
      courseName: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.totalDuration ? `${Math.round(course.totalDuration / 60)} hours` : "N/A",
      totalModules: course.modules.length,
      totalLessons: lessonCount,
      price: course.price,
      curriculum: curriculumText,
    },
  }).catch(() => {});

  // Notify admin
  sendEmail({
    to: process.env.FROM_EMAIL || "info@kkitbd.com",
    subject: `New Course Outline Request: ${course.title}`,
    template: "courseOutlineAdmin",
    data: {
      studentName: data.name,
      studentEmail: data.email,
      studentPhone: data.phone,
      whatsapp: data.whatsapp || "N/A",
      courseName: course.title,
    },
  }).catch(() => {});

  return { message: "Course outline has been sent to your email" };
};

module.exports = { getAllCourses, getCourseById, getCourseBySlug, createCourse, updateCourse, deleteCourse, enrollInCourse, assignMentor, unassignMentor, assignTrainer, unassignTrainer, getCoursesByUser, requestModuleDownload, requestCourseOutline };
