const LiveClass = require("./live-class.model");

const getAll = async (query = {}) => {
  const filter = {};

  if (query.course) filter.course = query.course;
  if (query.status) filter.status = query.status;
  if (query.instructor) filter.instructor = query.instructor;

  if (query.upcoming === "true") {
    filter.scheduledAt = { $gte: new Date() };
    filter.status = { $in: ["scheduled", "live"] };
  }

  if (query.past === "true") {
    filter.scheduledAt = { $lt: new Date() };
  }

  return LiveClass.find(filter)
    .populate("course", "title slug thumbnail")
    .populate("instructor", "name email avatar")
    .sort({ scheduledAt: 1 });
};

const getById = async (id) => {
  return LiveClass.findById(id)
    .populate("course", "title slug thumbnail")
    .populate("instructor", "name email avatar")
    .populate("attendees", "name email avatar");
};

const create = async (data) => {
  return LiveClass.create(data);
};

const update = async (id, data) => {
  return LiveClass.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const remove = async (id) => {
  return LiveClass.findByIdAndDelete(id);
};

const joinLiveClass = async (classId, userId) => {
  const liveClass = await LiveClass.findById(classId);
  if (!liveClass) return null;

  if (liveClass.attendees.includes(userId)) {
    return { alreadyJoined: true, liveClass };
  }

  if (liveClass.attendees.length >= liveClass.maxAttendees) {
    return { full: true, liveClass };
  }

  liveClass.attendees.push(userId);
  await liveClass.save();
  return { liveClass };
};

const getUpcoming = async () => {
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return LiveClass.find({
    scheduledAt: { $gte: now, $lte: sevenDaysLater },
    status: { $in: ["scheduled", "live"] },
  })
    .populate("course", "title slug thumbnail")
    .populate("instructor", "name email avatar")
    .sort({ scheduledAt: 1 });
};

module.exports = { getAll, getById, create, update, remove, joinLiveClass, getUpcoming };
