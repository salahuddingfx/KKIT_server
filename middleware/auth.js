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

const getTokensFromReq = (req) => {
  const isAdmin = isAdminRequest(req);
  const tokens = [];

  // Priority 1: Explicit Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    tokens.push(req.headers.authorization.split(" ")[1]);
  }

  // Priority 2: App context cookie
  if (req.cookies) {
    if (isAdmin && req.cookies.admin_accessToken) {
      tokens.push(req.cookies.admin_accessToken);
    } else if (!isAdmin && req.cookies.client_accessToken) {
      tokens.push(req.cookies.client_accessToken);
    }
    // Priority 3: Fallback generic cookie
    if (req.cookies.accessToken) {
      tokens.push(req.cookies.accessToken);
    }
  }

  return [...new Set(tokens.filter(Boolean))];
};

const protect = async (req, res, next) => {
  const tokens = getTokensFromReq(req);

  if (tokens.length === 0) {
    return next(ApiError.unauthorized("Not authorized to access this route"));
  }

  let lastError = null;
  for (const token of tokens) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password -refreshToken");

      if (!user) {
        lastError = ApiError.unauthorized("User not found");
        continue;
      }

      if (!user.isActive) {
        return next(ApiError.forbidden("Account has been deactivated"));
      }

      req.user = user;
      return next();
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError?.name === "JsonWebTokenError") {
    return next(ApiError.unauthorized("Invalid token"));
  }
  if (lastError?.name === "TokenExpiredError") {
    return next(ApiError.unauthorized("Token expired"));
  }
  return next(lastError || ApiError.unauthorized("Authentication failed"));
};

const optionalAuth = async (req, res, next) => {
  const tokens = getTokensFromReq(req);

  for (const token of tokens) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password -refreshToken");
      if (user && user.isActive) {
        req.user = user;
        break;
      }
    } catch {
      // try next token candidate
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
