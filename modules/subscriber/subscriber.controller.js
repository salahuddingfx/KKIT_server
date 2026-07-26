const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const service = require("./subscriber.service");

const subscribe = catchAsync(async (req, res) => {
  const sub = await service.subscribe(req.body.email, req.body.name, req.body.source);
  ApiResponse.created(res, sub);
});

const getAll = catchAsync(async (req, res) => {
  const result = await service.getAll(req.query, { page: req.query.page, limit: req.query.limit });
  ApiResponse.paginated(res, result.data, result.meta);
});

const unsubscribe = catchAsync(async (req, res) => {
  const sub = await service.unsubscribe(req.body.email);
  ApiResponse.success(res, sub, "Unsubscribed successfully");
});

const remove = catchAsync(async (req, res) => {
  await service.remove(req.params.id);
  ApiResponse.success(res, null, "Subscriber deleted");
});

const exportCSV = catchAsync(async (req, res) => {
  const subs = await service.exportAll();
  const csv = "email,name,date\n" + subs.map((s) => `${s.email},${s.name || ""},${s.createdAt.toISOString()}`).join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=subscribers.csv");
  res.send(csv);
});

module.exports = { subscribe, getAll, unsubscribe, remove, exportCSV };
