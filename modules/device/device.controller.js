const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const deviceService = require("./device.service");

const getActiveDevices = catchAsync(async (req, res) => {
  const ip = req.ip || req.connection?.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const devices = await deviceService.getActiveDevices(req.user._id, ip, userAgent);
  ApiResponse.success(res, devices);
});

const removeDevice = catchAsync(async (req, res) => {
  await deviceService.removeDevice(req.user._id, req.params.deviceId);
  ApiResponse.success(res, null, "Device removed");
});

const removeAllDevices = catchAsync(async (req, res) => {
  const ip = req.ip || req.connection?.remoteAddress;
  const userAgent = req.headers["user-agent"];
  await deviceService.removeAllDevices(req.user._id, ip, userAgent);
  ApiResponse.success(res, null, "All other devices logged out");
});

module.exports = { getActiveDevices, removeDevice, removeAllDevices };
