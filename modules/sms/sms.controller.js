const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const ApiError = require("../../utils/apiError");
const { sendSMS } = require("../../services/sms/sms.service");
const env = require("../../config/env");

/**
 * Get current SMS config status (Masked sensitive keys)
 */
const getSmsConfigStatus = catchAsync(async (req, res) => {
  const isConfigured = Boolean(
    env.SMS_API_KEY &&
    env.SMS_API_KEY !== "your_sms_api_key_here" &&
    env.SMS_API_KEY.trim().length > 0
  );

  const statusData = {
    enabled: env.SMS_ENABLED,
    provider: env.SMS_PROVIDER,
    senderId: env.SMS_SENDER_ID,
    isConfigured,
    mode: isConfigured && env.SMS_ENABLED ? "LIVE" : "MOCK",
    supportedProviders: ["bulksmsbd", "greenweb", "alphasms", "twilio", "generic"],
  };

  res.status(200).json(new ApiResponse(200, statusData, "SMS Gateway status fetched successfully"));
});

/**
 * Send Test SMS (Admin Only)
 */
const sendTestSMS = catchAsync(async (req, res) => {
  const { to, message } = req.body;

  if (!to) {
    throw new ApiError(400, "Recipient phone number 'to' is required.");
  }

  const msgContent = message || "This is a test SMS from KKIT platform to verify SMS Gateway integration.";
  const result = await sendSMS({ to, message: msgContent });

  res.status(200).json(new ApiResponse(200, result, "Test SMS dispatched successfully"));
});

module.exports = {
  getSmsConfigStatus,
  sendTestSMS,
};
