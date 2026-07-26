const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const env = require("../config/env");
const User = require("../modules/user/user.model");

const isAdminRequest = (req) => {
  const origin = req.headers.origin || req.headers.referer || "";
  const adminUrl = env.ADMIN_URL || "http://localhost:4001";
  const appContext = req.headers["x-app-context"];

  if (appContext === "admin") return true;
  if (appContext === "client") return false;

  return (
    (origin && origin.includes(adminUrl)) ||
    (origin && origin.includes(":4001"))
  );
};

const getAccessTokenFromReq = (req) => {
  const isAdmin = isAdminRequest(req);

  if (req.cookies) {
    if (isAdmin && req.cookies.admin_accessToken) {
      return req.cookies.admin_accessToken;
    }
    if (!isAdmin && req.cookies.client_accessToken) {
      return req.cookies.client_accessToken;
    }
  }

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
};

const protect = async (req, res, next) => {
  try {
    const token = getAccessTokenFromReq(req);

    if (!token) {
      return next(ApiError.unauthorized("Not authorized to access this route"));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -refreshToken");

    if (!user) {
      return next(ApiError.unauthorized("User not found"));
    }

    if (!user.isActive) {
      return next(ApiError.forbidden("Account has been deactivated"));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(ApiError.unauthorized("Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Token expired"));
    }
    next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = getAccessTokenFromReq(req);

    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password -refreshToken");
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch {
    // ignore
  }
  next();
};

module.exports = { protect, optionalAuth };
