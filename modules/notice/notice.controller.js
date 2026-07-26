const noticeService = require("./notice.service");
const catchAsync = require("../../utils/catchAsync");

/**
 * GET /notices
 */
const getNotices = catchAsync(async (req, res) => {
  const result = await noticeService.getNotices(req.query);

  res.status(200).json({
    success: true,
    data: result.notices,
    meta: result.pagination,
  });
});

/**
 * GET /notices/:id
 */
const getNoticeById = catchAsync(async (req, res) => {
  const notice = await noticeService.getNoticeById(req.params.id);

  res.status(200).json({
    success: true,
    data: notice,
  });
});

/**
 * POST /notices
 */
const createNotice = catchAsync(async (req, res) => {
  const notice = await noticeService.createNotice({
    ...req.body,
    author: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: notice,
  });
});

/**
 * PUT /notices/:id
 */
const updateNotice = catchAsync(async (req, res) => {
  const notice = await noticeService.updateNotice(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: notice,
  });
});

/**
 * DELETE /notices/:id
 */
const deleteNotice = catchAsync(async (req, res) => {
  await noticeService.deleteNotice(req.params.id);

  res.status(200).json({
    success: true,
    message: "Notice deleted successfully",
  });
});

/**
 * POST /notices/:id/read
 */
const markAsRead = catchAsync(async (req, res) => {
  const notice = await noticeService.markAsRead(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    data: notice,
  });
});

/**
 * GET /notices/unread/count
 */
const getUnreadCount = catchAsync(async (req, res) => {
  const count = await noticeService.getUnreadCount(req.user._id);

  res.status(200).json({
    success: true,
    data: { count },
  });
});

module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  markAsRead,
  getUnreadCount,
};
