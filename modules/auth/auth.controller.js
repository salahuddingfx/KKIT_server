const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const authService = require("./auth.service");
const env = require("../../config/env");

const isProd = process.env.NODE_ENV === "production";

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 5 * 60 * 60 * 1000, // 5 hours
  path: "/",
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

const isAdminRequest = (req) => {
  const origin = req.headers.origin || req.headers.referer || "";
  const adminUrl = env.ADMIN_URL || "https://admin.kkitbd.com";
  return (
    (origin && origin.includes(adminUrl)) ||
    (origin && (origin.includes("admin.kkitbd.com") || origin.includes(":4001"))) ||
    req.headers["x-app-context"] === "admin"
  );
};

const setTokenCookies = (req, res, accessToken, refreshToken) => {
  const isAdmin = isAdminRequest(req);
  if (isAdmin) {
    res.cookie("admin_accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie("admin_refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  } else {
    res.cookie("client_accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie("client_refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  }
  // Clear any legacy generic shared cookies to prevent cross-app session leaking
  res.clearCookie("accessToken", { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax", path: "/" });
  res.clearCookie("refreshToken", { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax", path: "/" });
};

const clearTokenCookies = (req, res) => {
  const isAdmin = isAdminRequest(req);
  if (isAdmin) {
    res.clearCookie("admin_accessToken", { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax", path: "/" });
    res.clearCookie("admin_refreshToken", { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax", path: "/" });
  } else {
    res.clearCookie("client_accessToken", { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax", path: "/" });
    res.clearCookie("client_refreshToken", { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax", path: "/" });
  }
  res.clearCookie("accessToken", { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax", path: "/" });
  res.clearCookie("refreshToken", { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax", path: "/" });
};

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  ApiResponse.success(res, result);
});

const verifyRegister = catchAsync(async (req, res) => {
  const verifyData = {
    ...req.body,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.headers["user-agent"],
  };
  const { user, accessToken, refreshToken } = await authService.verifyRegister(verifyData);
  setTokenCookies(req, res, accessToken, refreshToken);
  ApiResponse.success(res, { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken });
});

const login = catchAsync(async (req, res) => {
  const loginData = {
    ...req.body,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.headers["user-agent"],
  };
  const result = await authService.login(loginData);
  if (!result.otpRequired && result.accessToken) {
    setTokenCookies(req, res, result.accessToken, result.refreshToken);
    ApiResponse.success(res, { user: { _id: result.user._id, name: result.user.name, email: result.user.email, role: result.user.role }, accessToken: result.accessToken, refreshToken: result.refreshToken });
  } else {
    ApiResponse.success(res, result);
  }
});

const verifyLogin = catchAsync(async (req, res) => {
  const verifyData = {
    ...req.body,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.headers["user-agent"],
  };
  const { user, accessToken, refreshToken, deviceInfo } = await authService.verifyLogin(verifyData);
  setTokenCookies(req, res, accessToken, refreshToken);
  ApiResponse.success(res, { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken, deviceInfo });
});

const refresh = catchAsync(async (req, res) => {
  const isAdmin = isAdminRequest(req);
  const refreshTokenInput = isAdmin
    ? (req.cookies?.admin_refreshToken || req.cookies?.refreshToken)
    : (req.cookies?.client_refreshToken || req.cookies?.refreshToken);

  const { accessToken, refreshToken } = await authService.refreshAccessToken(refreshTokenInput);
  setTokenCookies(req, res, accessToken, refreshToken);
  ApiResponse.success(res, { user: null });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  ApiResponse.success(res, result);
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.params.token || req.body.token || req.body.otp;
  const result = await authService.resetPassword(token, req.body.password);
  ApiResponse.success(res, result);
});

const changePassword = catchAsync(async (req, res) => {
  const result = await authService.changePassword(
    req.user._id,
    req.body.currentPassword,
    req.body.newPassword
  );
  ApiResponse.success(res, result, "Password updated successfully");
});

const getMe = catchAsync(async (req, res) => {
  if (!req.user) {
    return res.status(200).json({
      success: false,
      message: "Not authenticated",
      data: null
    });
  }
  const user = await authService.getMe(req.user._id);
  ApiResponse.success(res, user);
});

const updateProfile = catchAsync(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  ApiResponse.success(res, user, "Profile updated successfully");
});

const logout = catchAsync(async (req, res) => {
  clearTokenCookies(req, res);
  ApiResponse.success(res, null, "Logged out successfully");
});

module.exports = {
  register,
  verifyRegister,
  login,
  verifyLogin,
  refresh,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  updateProfile,
  logout,
};
