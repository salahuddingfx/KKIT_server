const Submission = require("./submission.model");
const Assignment = require("../assignment/assignment.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");

const getAllSubmissions = async (query, options) => {
  const filter = {};
  if (query.assignment) filter.assignment = query.assignment;
  if (query.student) filter.student = query.student;
  if (query.course) filter.course = query.course;
  if (query.status) filter.status = query.status;
  return paginate(Submission, filter, {
    ...options,
    populate: "student assignment course",
  });
};

const getSubmissionById = async (id) => {
  const submission = await Submission.findById(id)
    .populate("student", "name email avatar")
    .populate("assignment", "title maxPoints dueDate course")
    .populate("course", "title slug")
    .populate("grade.gradedBy", "name email")
    .populate("feedback.givenBy", "name email");
  if (!submission) throw ApiError.notFound("Submission not found");
  return submission;
};

const getMySubmissions = async (studentId, query) => {
  const filter = { student: studentId };
  if (query.assignment) filter.assignment = query.assignment;
  if (query.course) filter.course = query.course;
  if (query.status) filter.status = query.status;
  return paginate(Submission, filter, {
    ...query,
    populate: "assignment course",
  });
};

const submitAssignment = async (data) => {
  const assignment = await Assignment.findById(data.assignment);
  if (!assignment) throw ApiError.notFound("Assignment not found");

  if (assignment.status !== "published") {
    throw ApiError.badRequest("Assignment is not accepting submissions");
  }

  // Check due date
  const now = new Date();
  if (!assignment.allowLateSubmission && now > assignment.dueDate) {
    throw ApiError.badRequest("Submission deadline has passed");
  }

  // Check max attempts
  const existingCount = await Submission.countDocuments({
    assignment: data.assignment,
    student: data.student,
  });
  if (existingCount >= assignment.maxSubmissions) {
    throw ApiError.badRequest(`Maximum ${assignment.maxSubmissions} submission(s) allowed`);
  }

  // Check if already graded (prevent re-submission without return)
  const lastSubmission = await Submission.findOne({
    assignment: data.assignment,
    student: data.student,
  }).sort("-attemptNumber");

  if (lastSubmission && lastSubmission.status === "graded") {
    throw ApiError.badRequest("Assignment already graded. Wait for it to be returned.");
  }

  const isLate = now > assignment.dueDate;

  const submission = await Submission.create({
    ...data,
    attemptNumber: existingCount + 1,
    isLate,
    status: "submitted",
  });

  // Update assignment stats
  assignment.totalSubmissions += 1;
  await assignment.save();

  return submission;
};

const gradeSubmission = async (id, gradeData, gradedBy) => {
  const submission = await Submission.findById(id);
  if (!submission) throw ApiError.notFound("Submission not found");

  const assignment = await Assignment.findById(submission.assignment);

  // Calculate percentage: raw points / assignment maxPoints * 100
  // The server stores raw points; getMyGrades scales to 70
  let percentage = gradeData.points !== undefined
    ? Math.round((gradeData.points / assignment.maxPoints) * 100)
    : 0;
  let letter = getLetterGrade(percentage);

  submission.grade = {
    points: gradeData.points,
    percentage,
    letter,
    gradedAt: new Date(),
    gradedBy,
  };
  submission.status = "graded";

  if (gradeData.feedback) {
    submission.feedback = {
      text: gradeData.feedback,
      givenAt: new Date(),
      givenBy: gradedBy,
    };
  }

  if (gradeData.rubricScores && gradeData.rubricScores.length > 0) {
    submission.rubricScores = gradeData.rubricScores;

    // Auto-calculate points from rubric scores if not explicitly provided
    if (gradeData.points === undefined || gradeData.points === null) {
      const rubricTotal = gradeData.rubricScores.reduce(
        (sum, r) => sum + (r.awardedPoints || 0),
        0
      );
      gradeData.points = rubricTotal;
      const totalMax = gradeData.rubricScores.reduce(
        (sum, r) => sum + (r.maxPoints || 0),
        0
      );
      percentage = totalMax > 0 ? Math.round((rubricTotal / totalMax) * 100) : 0;
      letter = getLetterGrade(percentage);
    }
  }

  await submission.save();

  // Update assignment average grade
  const stats = await Submission.aggregate([
    { $match: { assignment: submission.assignment, status: "graded" } },
    { $group: { _id: null, avg: { $avg: "$grade.percentage" } } },
  ]);
  if (stats.length > 0) {
    await Assignment.findByIdAndUpdate(submission.assignment, {
      averageGrade: Math.round(stats[0].avg * 10) / 10,
    });
  }

  return submission;
};

const returnSubmission = async (id, returnNote, returnedBy) => {
  const submission = await Submission.findById(id);
  if (!submission) throw ApiError.notFound("Submission not found");

  submission.status = "returned";
  submission.returnNote = returnNote;
  submission.returnedAt = new Date();
  submission.returnedBy = returnedBy;
  await submission.save();

  return submission;
};

const deleteSubmission = async (id) => {
  const submission = await Submission.findByIdAndDelete(id);
  if (!submission) throw ApiError.notFound("Submission not found");
  return submission;
};

const MAX_GRADE = 70;

const getMyGrades = async (studentId) => {
  const submissions = await Submission.find({
    student: studentId,
    status: "graded",
  })
    .populate("assignment", "title maxPoints passingPoints course rubricCriteria milestones")
    .populate("course", "title slug")
    .sort("-grade.gradedAt")
    .lean();

  // Scale: each assignment's points are scaled proportionally so total max = 70
  // Raw max = sum of all assignment maxPoints across graded submissions
  const rawTotalMax = submissions.reduce((sum, s) => sum + (s.assignment?.maxPoints || 0), 0);
  const rawTotalPoints = submissions.reduce((sum, s) => sum + (s.grade?.points || 0), 0);
  const scale = rawTotalMax > 0 ? MAX_GRADE / rawTotalMax : 1;

  const scaledTotal = Math.round(rawTotalPoints * scale * 10) / 10;

  // Per-course breakdown
  const courseMap = {};
  for (const sub of submissions) {
    const courseId = sub.course?._id?.toString() || "uncategorized";
    const courseTitle = sub.course?.title || "Uncategorized";
    if (!courseMap[courseId]) {
      courseMap[courseId] = { courseId, courseTitle, submissions: [], rawPoints: 0, rawMax: 0 };
    }
    courseMap[courseId].submissions.push(sub);
    courseMap[courseId].rawPoints += sub.grade?.points || 0;
    courseMap[courseId].rawMax += sub.assignment?.maxPoints || 0;
  }

  const courses = Object.values(courseMap).map((c) => {
    const scaled = Math.round(c.rawPoints * scale * 10) / 10;
    const scaledMax = Math.round(c.rawMax * scale * 10) / 10;
    return {
      courseId: c.courseId,
      courseTitle: c.courseTitle,
      submissions: c.submissions,
      scaledPoints: scaled,
      scaledMax,
      percentage: scaledMax > 0 ? Math.round((scaled / scaledMax) * 100) : 0,
      letterGrade: getLetterGrade(scaledMax > 0 ? Math.round((scaled / scaledMax) * 100) : 0),
    };
  });

  // Grade distribution
  const distribution = { "A+": 0, A: 0, "A-": 0, "B+": 0, B: 0, "B-": 0, "C+": 0, C: 0, "C-": 0, "D+": 0, D: 0, F: 0 };
  for (const sub of submissions) {
    const letter = sub.grade?.letter || "F";
    if (distribution[letter] !== undefined) distribution[letter]++;
    else distribution.F++;
  }

  return {
    maxGrade: MAX_GRADE,
    overall: {
      scaledPoints: scaledTotal,
      maxGrade: MAX_GRADE,
      percentage: MAX_GRADE > 0 ? Math.round((scaledTotal / MAX_GRADE) * 100) : 0,
      letterGrade: getLetterGrade(MAX_GRADE > 0 ? Math.round((scaledTotal / MAX_GRADE) * 100) : 0),
      rawTotalPoints,
      rawTotalMax,
      totalSubmissions: submissions.length,
    },
    courses,
    submissions: submissions.map((s) => {
      const raw = s.grade?.points || 0;
      const rawMax = s.assignment?.maxPoints || 0;
      return {
        _id: s._id,
        assignmentTitle: s.assignment?.title || "Unknown",
        courseTitle: s.course?.title || "Unknown",
        points: Math.round(raw * scale * 10) / 10,
        maxPoints: Math.round(rawMax * scale * 10) / 10,
        percentage: s.grade?.percentage || 0,
        letter: s.grade?.letter || "F",
        gradedAt: s.grade?.gradedAt,
        feedback: s.feedback?.text || null,
        rubricScores: s.rubricScores || [],
        milestoneProgress: s.milestoneProgress || [],
        isLate: s.isLate,
        attemptNumber: s.attemptNumber,
      };
    }),
    distribution,
  };
};

const getLetterGrade = (percentage) => {
  if (percentage >= 97) return "A+";
  if (percentage >= 93) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 87) return "B+";
  if (percentage >= 83) return "B";
  if (percentage >= 80) return "B-";
  if (percentage >= 77) return "C+";
  if (percentage >= 73) return "C";
  if (percentage >= 70) return "C-";
  if (percentage >= 67) return "D+";
  if (percentage >= 60) return "D";
  return "F";
};

const completeMilestone = async (submissionId, milestoneIndex, userId) => {
  const submission = await Submission.findById(submissionId);
  if (!submission) throw ApiError.notFound("Submission not found");
  if (submission.student.toString() !== userId.toString()) {
    throw ApiError.forbidden("Not your submission");
  }

  const assignment = await Assignment.findById(submission.assignment);
  if (!assignment) throw ApiError.notFound("Assignment not found");

  if (!assignment.milestones || !assignment.milestones[milestoneIndex]) {
    throw ApiError.notFound("Milestone not found");
  }

  const milestone = assignment.milestones[milestoneIndex];

  // Init milestoneProgress if empty
  if (!submission.milestoneProgress || submission.milestoneProgress.length === 0) {
    submission.milestoneProgress = assignment.milestones.map((m) => ({
      milestoneTitle: m.title,
      completed: false,
      awardedPoints: 0,
    }));
  }

  const progress = submission.milestoneProgress[milestoneIndex];
  if (progress.completed) {
    throw ApiError.badRequest("Milestone already completed");
  }

  progress.completed = true;
  progress.completedAt = new Date();
  progress.awardedPoints = milestone.maxPoints || 0;

  await submission.save();
  return submission;
};

module.exports = {
  getAllSubmissions,
  getSubmissionById,
  getMySubmissions,
  getMyGrades,
  submitAssignment,
  gradeSubmission,
  returnSubmission,
  deleteSubmission,
  completeMilestone,
};
