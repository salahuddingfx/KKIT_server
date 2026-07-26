const crypto = require("crypto");
const DeviceSession = require("./device.model");
const ApiError = require("../../utils/apiError");

const MAX_DEVICES = 3;
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

const generateFingerprintFallback = (userId, ip, userAgent) => {
  return crypto
    .createHash("md5")
    .update(`${userId}-${userAgent || "Unknown"}-${ip || "127.0.0.1"}`)
    .digest("hex");
};

const registerDevice = async (userId, fingerprint, ip, userAgent) => {
  const fp = fingerprint || generateFingerprintFallback(userId, ip, userAgent);

  const activeSessions = await DeviceSession.find({
    user: userId,
    isActive: true,
  }).sort("lastActivity");

  // Check if this device or this IP/fingerprint already has a session
  const existingSession = activeSessions.find(
    (s) => s.fingerprint === fp || (s.ip === ip && s.userAgent === userAgent)
  );

  if (existingSession) {
    existingSession.lastActivity = new Date();
    existingSession.fingerprint = fp;
    if (ip) existingSession.ip = ip;
    if (userAgent) existingSession.userAgent = userAgent;
    existingSession.expiresAt = new Date(Date.now() + SESSION_DURATION);
    await existingSession.save();
    return { allowed: true, sessionId: existingSession._id };
  }

  // If under limit, allow registration
  if (activeSessions.length < MAX_DEVICES) {
    const session = await DeviceSession.create({
      user: userId,
      fingerprint: fp,
      ip: ip || "127.0.0.1",
      userAgent: userAgent || "Unknown Browser",
      expiresAt: new Date(Date.now() + SESSION_DURATION),
    });
    return { allowed: true, sessionId: session._id };
  }

  // Over limit — reject
  return {
    allowed: false,
    activeDevices: activeSessions.map((s) => ({
      id: s._id,
      deviceInfo: s.deviceInfo,
      ip: s.ip,
      lastActivity: s.lastActivity,
    })),
  };
};

const removeDevice = async (userId, sessionId) => {
  const session = await DeviceSession.findOneAndDelete({
    _id: sessionId,
    user: userId,
  });
  if (!session) throw ApiError.notFound("Device session not found");
  return session;
};

const removeAllDevices = async (userId, keepIp, keepUserAgent) => {
  await DeviceSession.deleteMany({ user: userId });
  if (keepIp || keepUserAgent) {
    await registerDevice(userId, null, keepIp, keepUserAgent);
  }
  return true;
};

const getActiveDevices = async (userId, ip, userAgent) => {
  let active = await DeviceSession.find({ user: userId, isActive: true })
    .sort("-lastActivity")
    .select("-fingerprint -__v");

  if (active.length === 0 && (ip || userAgent)) {
    await registerDevice(userId, null, ip, userAgent);
    active = await DeviceSession.find({ user: userId, isActive: true })
      .sort("-lastActivity")
      .select("-fingerprint -__v");
  } else if (ip && userAgent) {
    const fp = generateFingerprintFallback(userId, ip, userAgent);
    const curr = active.find((s) => s.fingerprint === fp || (s.ip === ip && s.userAgent === userAgent));
    if (curr) {
      await DeviceSession.updateOne({ _id: curr._id }, { lastActivity: new Date() });
    }
  }

  return active;
};

const validateDevice = async (userId, fingerprint) => {
  const session = await DeviceSession.findOne({
    user: userId,
    fingerprint,
    isActive: true,
  });

  if (!session) return false;

  session.lastActivity = new Date();
  await session.save();
  return true;
};

module.exports = {
  registerDevice,
  removeDevice,
  removeAllDevices,
  getActiveDevices,
  validateDevice,
  MAX_DEVICES,
};
