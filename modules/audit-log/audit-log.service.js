const AuditLog = require("./audit-log.model");
const { paginate } = require("../../utils/pagination");
const { getClientIp, resolveGeoLocation, parseUserAgent } = require("../../utils/geoip");

/**
 * Record a new audit / visitor event
 */
const createLog = async (logData) => {
  try {
    return await AuditLog.create(logData);
  } catch (error) {
    console.error("[AuditLog Service Error] Failed to record log:", error.message);
    return null;
  }
};

/**
 * Log helper for middleware & controller hooks
 */
const logActivity = async (req, res, action, category = "visitor", details = {}, status = "info") => {
  const ip = getClientIp(req);
  const geo = resolveGeoLocation(req, ip);
  const uaInfo = parseUserAgent(req?.headers?.["user-agent"] || "");

  const user = req?.user;

  const logData = {
    timestamp: new Date(),
    action,
    category,
    user: user?._id || null,
    userName: user?.name || details?.name || details?.userName || null,
    userEmail: user?.email || details?.email || details?.userEmail || null,
    userPhone: user?.phone || details?.phone || details?.userPhone || null,
    ip,
    country: geo.country,
    countryCode: geo.countryCode,
    city: geo.city,
    userAgent: req?.headers?.["user-agent"] || "",
    browser: uaInfo.browser,
    os: uaInfo.os,
    device: uaInfo.device,
    path: req?.originalUrl || req?.path || "/",
    method: req?.method || "GET",
    statusCode: res?.statusCode || 200,
    details,
    status,
  };

  return createLog(logData);
};

/**
 * Get paginated audit logs with search & filters
 */
const getLogs = async (query, options) => {
  const filter = {};

  if (query.category) filter.category = query.category;
  if (query.action) filter.action = query.action;
  if (query.status) filter.status = query.status;
  if (query.country) filter.country = new RegExp(query.country, "i");

  if (query.search) {
    const s = query.search.trim();
    filter.$or = [
      { userName: new RegExp(s, "i") },
      { userEmail: new RegExp(s, "i") },
      { userPhone: new RegExp(s, "i") },
      { ip: new RegExp(s, "i") },
      { path: new RegExp(s, "i") },
      { action: new RegExp(s, "i") },
      { country: new RegExp(s, "i") },
    ];
  }

  if (query.startDate || query.endDate) {
    filter.timestamp = {};
    if (query.startDate) filter.timestamp.$gte = new Date(query.startDate);
    if (query.endDate) filter.timestamp.$lte = new Date(query.endDate);
  }

  return paginate(AuditLog, filter, {
    ...options,
    sort: { timestamp: -1, createdAt: -1 },
    populate: "user",
  });
};

/**
 * Analytics: Top countries, peak hours, device stats
 */
const getStats = async () => {
  const totalLogs = await AuditLog.countDocuments();
  const identifiedContacts = await AuditLog.countDocuments({
    $or: [{ userEmail: { $ne: null } }, { userName: { $ne: null } }],
  });

  // Top Countries Breakdown
  const topCountries = await AuditLog.aggregate([
    { $group: { _id: "$country", count: { $sum: 1 }, code: { $first: "$countryCode" } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // Peak Visitor Hours Breakdown (00:00 - 23:00)
  const peakHoursRaw = await AuditLog.aggregate([
    {
      $group: {
        _id: { $hour: "$timestamp" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  // Format 24 hours
  const peakHoursMap = new Map(peakHoursRaw.map((h) => [h._id, h.count]));
  const peakHours = Array.from({ length: 24 }).map((_, hour) => ({
    hour: `${hour.toString().padStart(2, "0")}:00`,
    count: peakHoursMap.get(hour) || 0,
  }));

  // Top Actions Breakdown
  const topActions = await AuditLog.aggregate([
    { $group: { _id: "$action", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);

  // Device Type Breakdown
  const deviceStats = await AuditLog.aggregate([
    { $group: { _id: "$device", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Browser Breakdown
  const browserStats = await AuditLog.aggregate([
    { $group: { _id: "$browser", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  // Find overall peak hour
  const highestHour = peakHours.reduce((prev, curr) => (curr.count > prev.count ? curr : prev), { hour: "12:00", count: 0 });

  return {
    totalLogs,
    identifiedContacts,
    peakHour: highestHour.hour,
    peakCount: highestHour.count,
    topCountry: topCountries[0] ? topCountries[0]._id : "Bangladesh",
    topCountries: topCountries.map((c) => ({ country: c._id || "Unknown", count: c.count, code: c.code || "BD" })),
    peakHours,
    topActions: topActions.map((a) => ({ action: a._id, count: a.count })),
    deviceStats: deviceStats.map((d) => ({ device: d._id || "Desktop", count: d.count })),
    browserStats: browserStats.map((b) => ({ browser: b._id || "Other", count: b.count })),
  };
};

module.exports = {
  createLog,
  logActivity,
  getLogs,
  getStats,
};
