const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const service = require("./audit-log.service");

const getLogs = catchAsync(async (req, res) => {
  const result = await service.getLogs(req.query, {
    page: req.query.page || 1,
    limit: req.query.limit || 20,
  });
  ApiResponse.paginated(res, result.data, result.meta);
});

const getStats = catchAsync(async (req, res) => {
  const stats = await service.getStats();
  ApiResponse.success(res, stats, "Audit log analytics retrieved successfully");
});

module.exports = {
  getLogs,
  getStats,
};
