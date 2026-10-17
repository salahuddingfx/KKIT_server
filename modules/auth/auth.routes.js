const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { protect, optionalAuth } = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyOtpSchema, changePasswordSchema } = require("./auth.validation");

router.post("/register", validate(registerSchema), authController.register);
router.post("/verify-register", validate(verifyOtpSchema), authController.verifyRegister);
router.post("/login", validate(loginSchema), authController.login);
router.post("/verify-login", validate(verifyOtpSchema), authController.verifyLogin);
router.post("/refresh", authController.refresh);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password/:token?", validate(resetPasswordSchema), authController.resetPassword);
router.put("/change-password", protect, validate(changePasswordSchema), authController.changePassword);
router.put("/profile", protect, authController.updateProfile);
router.get("/me", optionalAuth, authController.getMe);
router.post("/logout", authController.logout);

module.exports = router;
