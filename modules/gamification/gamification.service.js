const Gamification = require("./gamification.model");
const EventEmitter = require("events");

const gamificationEmitter = new EventEmitter();
gamificationEmitter.setMaxListeners(20);

const POINTS = {
  LESSON_COMPLETE: 10,
  COURSE_ENROLL: 5,
  COURSE_COMPLETE: 100,
  ASSIGNMENT_SUBMIT: 25,
  PROJECT_SUBMIT: 25,
  PROJECT_APPROVE: 75,
  REVIEW_WRITE: 15,
  DISCUSSION_CREATE: 10,
  DISCUSSION_REPLY: 5,
  MILESTONE_COMPLETE: 5,
};

const BADGES = {
  FIRST_STEPS: { badgeId: "first_steps", name: "First Steps", description: "Complete your first lesson", icon: "🎯" },
  LESSON_HUNTER: { badgeId: "lesson_hunter", name: "Lesson Hunter", description: "Complete 10 lessons", icon: "📚" },
  LESSON_MASTER: { badgeId: "lesson_master", name: "Lesson Master", description: "Complete 50 lessons", icon: "🏆" },
  ENROLLED: { badgeId: "enrolled", name: "Enrolled", description: "Enroll in your first course", icon: "🎓" },
  GRADUATE: { badgeId: "graduate", name: "Graduate", description: "Complete a course", icon: "🎉" },
  MULTI_GRADUATE: { badgeId: "multi_graduate", name: "Multi Graduate", description: "Complete 3 courses", icon: "🌟" },
  ASSIGNMENT_ACE: { badgeId: "assignment_ace", name: "Assignment Ace", description: "Submit 5 assignments", icon: "✍️" },
  PROJECT_BUILDER: { badgeId: "project_builder", name: "Project Builder", description: "Submit a project", icon: "🔨" },
  PROJECT_MASTER: { badgeId: "project_master", name: "Project Master", description: "Get a project approved", icon: "🏅" },
  REVIEWER: { badgeId: "reviewer", name: "Reviewer", description: "Write your first review", icon: "⭐" },
  DISCUSSION_STARTER: { badgeId: "discussion_starter", name: "Discussion Starter", description: "Create your first discussion", icon: "💬" },
  HELPING_HAND: { badgeId: "helping_hand", name: "Helping Hand", description: "Reply to 5 discussions", icon: "🤝" },
  STREAK_WARRIOR: { badgeId: "streak_warrior", name: "Streak Warrior", description: "Maintain a 7-day streak", icon: "🔥" },
  STREAK_LEGEND: { badgeId: "streak_legend", name: "Streak Legend", description: "Maintain a 30-day streak", icon: "💎" },
  POINT_COLLECTOR: { badgeId: "point_collector", name: "Point Collector", description: "Earn 500 points", icon: "💰" },
  POINT_CHAMPION: { badgeId: "point_champion", name: "Point Champion", description: "Earn 2000 points", icon: "👑" },
};

const calculateLevel = (points) => Math.floor(Math.sqrt(points / 100)) + 1;

const getOrCreate = async (userId) => {
  let gamification = await Gamification.findOne({ user: userId });
  if (!gamification) {
    gamification = await Gamification.create({ user: userId });
  }
  return gamification;
};

const awardPoints = async (userId, amount, reason) => {
  const gamification = await getOrCreate(userId);
  gamification.points += amount;
  gamification.level = calculateLevel(gamification.points);
  gamification.pointsHistory.push({ amount, reason });
  if (gamification.pointsHistory.length > 100) {
    gamification.pointsHistory = gamification.pointsHistory.slice(-100);
  }
  await gamification.save();
  return gamification;
};

const checkAndAwardBadges = async (userId) => {
  const gamification = await getOrCreate(userId);
  const earned = gamification.badges.map((b) => b.badgeId);
  const toAward = [];

  const s = gamification.stats;
  const rules = [
    { id: "first_steps", condition: s.lessonsCompleted >= 1 },
    { id: "lesson_hunter", condition: s.lessonsCompleted >= 10 },
    { id: "lesson_master", condition: s.lessonsCompleted >= 50 },
    { id: "enrolled", condition: s.coursesCompleted >= 0 && (await Gamification.countDocuments({ user: userId })) > 0 },
    { id: "graduate", condition: s.coursesCompleted >= 1 },
    { id: "multi_graduate", condition: s.coursesCompleted >= 3 },
    { id: "assignment_ace", condition: s.assignmentsSubmitted >= 5 },
    { id: "project_builder", condition: s.projectsSubmitted >= 1 },
    { id: "project_master", condition: s.projectsSubmitted >= 1 },
    { id: "reviewer", condition: s.reviewsWritten >= 1 },
    { id: "discussion_starter", condition: s.discussionsCreated >= 1 },
    { id: "point_collector", condition: gamification.points >= 500 },
    { id: "point_champion", condition: gamification.points >= 2000 },
  ];

  for (const rule of rules) {
    if (!earned.includes(rule.id) && rule.condition) {
      const badgeDef = Object.values(BADGES).find((b) => b.badgeId === rule.id);
      if (badgeDef) {
        gamification.badges.push({ ...badgeDef });
        toAward.push(badgeDef);
      }
    }
  }

  if (toAward.length > 0) await gamification.save();
  return toAward;
};

const incrementStat = async (userId, field, amount = 1) => {
  const gamification = await getOrCreate(userId);
  gamification.stats[field] = (gamification.stats[field] || 0) + amount;
  await gamification.save();
  return gamification;
};

// --- Event handlers ---
gamificationEmitter.on("lesson_complete", async ({ userId }) => {
  await awardPoints(userId, POINTS.LESSON_COMPLETE, "Lesson completed");
  await incrementStat(userId, "lessonsCompleted");
  await checkAndAwardBadges(userId);
});

gamificationEmitter.on("course_enroll", async ({ userId }) => {
  await awardPoints(userId, POINTS.COURSE_ENROLL, "Course enrolled");
  await checkAndAwardBadges(userId);
});

gamificationEmitter.on("course_complete", async ({ userId }) => {
  await awardPoints(userId, POINTS.COURSE_COMPLETE, "Course completed");
  await incrementStat(userId, "coursesCompleted");
  await checkAndAwardBadges(userId);
});

gamificationEmitter.on("assignment_submit", async ({ userId }) => {
  await awardPoints(userId, POINTS.ASSIGNMENT_SUBMIT, "Assignment submitted");
  await incrementStat(userId, "assignmentsSubmitted");
  await checkAndAwardBadges(userId);
});

gamificationEmitter.on("project_submit", async ({ userId }) => {
  await awardPoints(userId, POINTS.PROJECT_SUBMIT, "Project submitted");
  await incrementStat(userId, "projectsSubmitted");
  await checkAndAwardBadges(userId);
});

gamificationEmitter.on("project_approve", async ({ userId }) => {
  await awardPoints(userId, POINTS.PROJECT_APPROVE, "Project approved");
  await checkAndAwardBadges(userId);
});

gamificationEmitter.on("review_write", async ({ userId }) => {
  await awardPoints(userId, POINTS.REVIEW_WRITE, "Review written");
  await incrementStat(userId, "reviewsWritten");
  await checkAndAwardBadges(userId);
});

gamificationEmitter.on("discussion_create", async ({ userId }) => {
  await awardPoints(userId, POINTS.DISCUSSION_CREATE, "Discussion created");
  await incrementStat(userId, "discussionsCreated");
  await checkAndAwardBadges(userId);
});

gamificationEmitter.on("discussion_reply", async ({ userId }) => {
  await awardPoints(userId, POINTS.DISCUSSION_REPLY, "Discussion reply");
  await checkAndAwardBadges(userId);
});

gamificationEmitter.on("milestone_complete", async ({ userId }) => {
  await awardPoints(userId, POINTS.MILESTONE_COMPLETE, "Milestone completed");
  await checkAndAwardBadges(userId);
});

const emitEvent = (event, data) => {
  gamificationEmitter.emit(event, data);
};

const getMyGamification = async (userId) => {
  return getOrCreate(userId);
};

const getAllBadges = async () => {
  return Object.values(BADGES);
};

const getLeaderboard = async ({ limit = 50 } = {}) => {
  return Gamification.find()
    .sort({ points: -1 })
    .limit(limit)
    .populate("user", "name avatar")
    .lean();
};

module.exports = {
  emitEvent,
  getMyGamification,
  getAllBadges,
  getLeaderboard,
  POINTS,
  BADGES,
};
