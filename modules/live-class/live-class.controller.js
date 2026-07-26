const liveClassService = require("./live-class.service");
const ApiResponse = require("../../utils/apiResponse");
const catchAsync = require("../../utils/catchAsync");

const getLiveClasses = catchAsync(async (req, res) => {
  const liveClasses = await liveClassService.getAll(req.query);
  ApiResponse.success(res, liveClasses, "Live classes fetched");
});

const getLiveClassById = catchAsync(async (req, res) => {
  const liveClass = await liveClassService.getById(req.params.id);
  if (!liveClass) return ApiResponse.success(res, null, "Live class not found", 404);
  ApiResponse.success(res, liveClass, "Live class fetched");
});

const getUpcomingClasses = catchAsync(async (req, res) => {
  const liveClasses = await liveClassService.getUpcoming();
  ApiResponse.success(res, liveClasses, "Upcoming live classes fetched");
});

const createLiveClass = catchAsync(async (req, res) => {
  const liveClass = await liveClassService.create(req.body);
  ApiResponse.created(res, liveClass, "Live class created");
});

const updateLiveClass = catchAsync(async (req, res) => {
  const liveClass = await liveClassService.update(req.params.id, req.body);
  if (!liveClass) return ApiResponse.success(res, null, "Live class not found", 404);
  ApiResponse.success(res, liveClass, "Live class updated");
});

const deleteLiveClass = catchAsync(async (req, res) => {
  const liveClass = await liveClassService.remove(req.params.id);
  if (!liveClass) return ApiResponse.success(res, null, "Live class not found", 404);
  ApiResponse.success(res, null, "Live class deleted");
});

const joinLiveClass = catchAsync(async (req, res) => {
  const result = await liveClassService.joinLiveClass(req.params.id, req.user._id);
  if (!result) return ApiResponse.success(res, null, "Live class not found", 404);
  if (result.alreadyJoined) return ApiResponse.success(res, null, "Already joined this live class", 400);
  if (result.full) return ApiResponse.success(res, null, "Live class is full", 400);
  ApiResponse.success(res, result.liveClass, "Joined live class successfully");
});

module.exports = {
  getLiveClasses,
  getLiveClassById,
  getUpcomingClasses,
  createLiveClass,
  updateLiveClass,
  deleteLiveClass,
  joinLiveClass,
};
