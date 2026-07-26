const Notice = require("./notice.model");
const ApiError = require("../../utils/apiError");

/**
 * Get all notices (with filters)
 */
const getNotices = async (filters = {}) => {
  const { page = 1, limit = 20, type, priority, targetAudience, isActive, search } = filters;

  const query = {};

  if (type) query.type = type;
  if (priority) query.priority = priority;
  if (targetAudience) query.targetAudience = targetAudience;
  if (isActive !== undefined) query.isActive = isActive;

  if (search) {
    query.$text = { $search: search };
  }

  // Exclude expired notices
  query.$or = [
    { expiresAt: null },
    { expiresAt: { $gt: new Date() } },
  ];

  const total = await Notice.countDocuments(query);
  const notices = await Notice.find(query)
    .populate("author", "name avatar")
    .sort({ isPinned: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  return {
    notices,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single notice by ID
 */
const getNoticeById = async (id) => {
  const notice = await Notice.findById(id).populate("author", "name avatar");
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }
  return notice;
};

/**
 * Create a new notice (admin/mentor only)
 */
const createNotice = async (data) => {
  const notice = await Notice.create(data);
  return notice.populate("author", "name avatar");
};

/**
 * Update a notice
 */
const updateNotice = async (id, data) => {
  const notice = await Notice.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("author", "name avatar");

  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  return notice;
};

/**
 * Delete a notice
 */
const deleteNotice = async (id) => {
  const notice = await Notice.findByIdAndDelete(id);
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }
  return notice;
};

/**
 * Mark notice as read by user
 */
const markAsRead = async (noticeId, userId) => {
  const notice = await Notice.findById(noticeId);
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  const alreadyRead = notice.readBy.some(
    (entry) => entry.user.toString() === userId.toString()
  );

  if (!alreadyRead) {
    notice.readBy.push({ user: userId, readAt: new Date() });
    await notice.save();
  }

  return notice;
};

/**
 * Get unread notices count for a user
 */
const getUnreadCount = async (userId) => {
  const count = await Notice.countDocuments({
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ],
    readBy: { $not: { $elemMatch: { user: userId } } },
  });

  return count;
};

module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  markAsRead,
  getUnreadCount,
};
