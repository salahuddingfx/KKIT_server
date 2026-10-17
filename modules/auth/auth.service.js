const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../user/user.model");
const ApiError = require("../../utils/apiError");
const env = require("../../config/env");
const { sendEmail } = require("../../services/email/email.service");
const { sendOtpSMS } = require("../../services/sms/sms.service");
const deviceService = require("../device/device.service");

const register = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw ApiError.conflict("Email already registered");
    }
    existingUser.name = data.name;
    existingUser.password = data.password;
    existingUser.phone = data.phone;
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    existingUser.otpCode = crypto.createHash("sha256").update(otp).digest("hex");
    existingUser.otpExpire = Date.now() + 15 * 60 * 1000;
    existingUser.otpPurpose = "register";
    await existingUser.save();
    
    sendEmail({
      to: existingUser.email,
      subject: "🛡️ [KKIT] Account Verification Code",
      template: "otp",
      data: {
        name: existingUser.name,
        otp,
        title: "Verify Your Account",
        description: "Thank you for joining KKIT! We received a request to verify your new account.",
      },
    }).catch(() => {});
    
    if (existingUser.phone) {
      sendOtpSMS({ to: existingUser.phone, otp }).catch(() => {});
    }

    return { email: existingUser.email, isEmailVerified: false, message: "OTP verification code sent to email/phone" };
  }

  const user = await User.create({
    ...data,
    isEmailVerified: false,
    isActive: false,
  });
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otpCode = crypto.createHash("sha256").update(otp).digest("hex");
  user.otpExpire = Date.now() + 15 * 60 * 1000;
  user.otpPurpose = "register";
  await user.save();

  sendEmail({
    to: user.email,
    subject: "🛡️ [KKIT] Account Verification Code",
    template: "otp",
    data: {
      name: user.name,
      otp,
      title: "Verify Your Account",
      description: "Thank you for joining KKIT! We received a request to verify your new account.",
    },
  }).catch(() => {});

  if (user.phone) {
    sendOtpSMS({ to: user.phone, otp }).catch(() => {});
  }

  return { email: user.email, isEmailVerified: false, message: "OTP verification code sent to email/phone" };
};

const verifyRegister = async ({ email, otp, fingerprint, ip, userAgent }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  if (user.isEmailVerified) {
    throw ApiError.badRequest("Email is already verified");
  }

  const hashedOtp = crypto.createHash("sha256").update(otp.trim()).digest("hex");
  if (user.otpCode !== hashedOtp || user.otpExpire < Date.now() || user.otpPurpose !== "register") {
    throw ApiError.badRequest("Invalid or expired verification code");
  }

  user.isEmailVerified = true;
  user.isActive = true;
  user.otpCode = undefined;
  user.otpExpire = undefined;
  user.otpPurpose = undefined;

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();

  await deviceService.registerDevice(user._id, fingerprint, ip, userAgent);

  sendEmail({
    to: user.email,
    subject: "Welcome to KKIT!",
    template: "welcome",
    data: { name: user.name },
  }).catch(() => {});

  return { user, accessToken, refreshToken };
};

const login = async ({ email, password, fingerprint, ip, userAgent }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const roleService = require("../role/role.service");
  const roleObj = await roleService.getRoleBySlug(user.role);
  const isStaff =
    ["super_admin", "admin", "ceo", "md", "finance", "mentor", "trainer", "support"].includes(user.role) ||
    (roleObj && roleObj.allowedPages && roleObj.allowedPages.length > 0);

  if (isStaff) {
    user.lastLogin = new Date();
    user.loginCount += 1;
    user.loginHistory.push({ date: new Date() });
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    await deviceService.registerDevice(user._id, fingerprint, ip, userAgent);

    const userData = user.toObject();
    delete userData.password;
    return {
      otpRequired: false,
      user: {
        ...userData,
        allowedPages: roleObj?.allowedPages || [],
        permissions: roleObj?.permissions || [],
      },
      accessToken,
      refreshToken,
      message: "Login successful",
    };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otpCode = crypto.createHash("sha256").update(otp).digest("hex");
  user.otpExpire = Date.now() + 15 * 60 * 1000;
  user.otpPurpose = "login";
  await user.save();

  sendEmail({
    to: user.email,
    subject: "🔑 [KKIT] Login Verification Code",
    template: "otp",
    data: {
      name: user.name,
      otp,
      title: "Login Verification",
      description: "We received a request to log into your account from a new browser session.",
    },
  }).catch(() => {});

  if (user.phone) {
    sendOtpSMS({ to: user.phone, otp }).catch(() => {});
  }

  return { otpRequired: true, email: user.email, message: "Verification code sent to email/phone" };
};

const verifyLogin = async ({ email, otp, fingerprint, ip, userAgent }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  if (!user.isActive) {
    throw ApiError.forbidden("Account has been deactivated");
  }

  const hashedOtp = crypto.createHash("sha256").update(otp.trim()).digest("hex");
  if (user.otpCode !== hashedOtp || user.otpExpire < Date.now() || user.otpPurpose !== "login") {
    throw ApiError.badRequest("Invalid or expired verification code");
  }

  user.otpCode = undefined;
  user.otpExpire = undefined;
  user.otpPurpose = undefined;
  user.lastLogin = new Date();
  user.loginCount += 1;
  user.loginHistory.push({ date: new Date() });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();

  let deviceInfo = null;
  const deviceResult = await deviceService.registerDevice(
    user._id,
    fingerprint,
    ip,
    userAgent
  );

  if (!deviceResult.allowed) {
    throw ApiError.forbidden(
      `Device limit reached (${deviceService.MAX_DEVICES}). Please logout from another device first.`
    );
  }
  deviceInfo = deviceResult;

  return { user, accessToken, refreshToken, deviceInfo };
};

const refreshAccessToken = async (token) => {
  if (!token) throw ApiError.badRequest("Refresh token required");

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { message: "If the email exists, a verification code has been sent" };
  }

  // Generate 6-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store hashed OTP
  user.passwordResetToken = crypto.createHash("sha256").update(otp).digest("hex");
  user.passwordResetExpire = Date.now() + 15 * 60 * 1000; // 15 minutes validation
  await user.save();

  sendEmail({
    to: user.email,
    subject: "🔒 [KKIT] Password Reset Verification Code",
    template: "otp",
    data: {
      name: user.name,
      otp,
      title: "Reset Password Verification",
      description: "We received a request to reset the password for your KKIT account.",
    },
  }).catch((err) => {
    console.error("Failed to send OTP email:", err);
  });

  if (user.phone) {
    sendOtpSMS({ to: user.phone, otp }).catch(() => {});
  }

  return { message: "If the email exists, a verification code has been sent" };
};

const resetPassword = async (token, password) => {
  if (!token) {
    throw ApiError.badRequest("Verification code/OTP is required");
  }

  const hashedToken = crypto.createHash("sha256").update(token.trim()).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw ApiError.badRequest("Invalid or expired verification code");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  user.refreshToken = undefined;
  await user.save();

  return { message: "Password reset successful" };
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw ApiError.notFound("User not found");
  if (!(await user.comparePassword(currentPassword))) {
    throw ApiError.unauthorized("Incorrect current password");
  }
  user.password = newPassword;
  await user.save();
  return { message: "Password updated successfully" };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) throw ApiError.notFound("User not found");
  const roleService = require("../role/role.service");
  const roleObj = await roleService.getRoleBySlug(user.role);
  return {
    ...user,
    allowedPages: roleObj?.allowedPages || [],
    permissions: roleObj?.permissions || [],
  };
};

const updateProfile = async (userId, data) => {
  const allowedFields = ["name", "phone", "bio", "designation", "avatar", "address", "socialLinks"];
  const updateData = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
  if (!user) throw ApiError.notFound("User not found");

  const roleService = require("../role/role.service");
  const roleObj = await roleService.getRoleBySlug(user.role);
  const userJson = user.toJSON ? user.toJSON() : { ...user };
  delete userJson.password;
  delete userJson.refreshToken;

  return {
    ...userJson,
    allowedPages: roleObj?.allowedPages || [],
    permissions: roleObj?.permissions || [],
  };
};

module.exports = {
  register,
  verifyRegister,
  login,
  verifyLogin,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  updateProfile,
};
