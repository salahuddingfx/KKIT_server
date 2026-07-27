const env = require("../../config/env");

const sendBulkSMSBD = require("./providers/bulksmsbd");
const sendGreenweb = require("./providers/greenweb");
const sendAlphaSMS = require("./providers/alphasms");
const sendTwilio = require("./providers/twilio");
const sendGeneric = require("./providers/generic");
const sendMockSMS = require("./providers/mock");

/**
 * Sanitize & normalize phone numbers (e.g. Bangladesh 017xxxxxxxx -> 88017xxxxxxxx)
 */
const normalizePhoneNumber = (phone) => {
  if (!phone) return "";
  let cleaned = String(phone).trim().replace(/[^0-9+]/g, "");
  
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }
  
  // Format 11-digit BD number starting with 01
  if (cleaned.length === 11 && cleaned.startsWith("01")) {
    return `88${cleaned}`;
  }
  
  return cleaned;
};

/**
 * Main SMS dispatcher
 * Automatically switches to live provider if credentials exist, otherwise falls back to Mock logger.
 */
const sendSMS = async ({ to, message }) => {
  const normalizedTo = normalizePhoneNumber(to);
  if (!normalizedTo) {
    throw new Error("Invalid or missing recipient phone number for SMS.");
  }

  const isEnabled = env.SMS_ENABLED;
  const apiKey = env.SMS_API_KEY;
  const provider = env.SMS_PROVIDER || "bulksmsbd";

  // Check if live API key is valid and SMS is enabled
  const hasValidCredentials =
    apiKey &&
    apiKey !== "your_sms_api_key_here" &&
    apiKey.trim().length > 0;

  if (!isEnabled || !hasValidCredentials) {
    return sendMockSMS({
      to: normalizedTo,
      message,
      reason: !isEnabled
        ? "SMS_ENABLED is set to false in .env"
        : "SMS_API_KEY is not set or using placeholder value in .env",
    });
  }

  try {
    switch (provider) {
      case "bulksmsbd":
        return await sendBulkSMSBD({ to: normalizedTo, message, config: env });
      case "greenweb":
        return await sendGreenweb({ to: normalizedTo, message, config: env });
      case "alphasms":
        return await sendAlphaSMS({ to: normalizedTo, message, config: env });
      case "twilio":
        return await sendTwilio({ to: normalizedTo, message, config: env });
      case "generic":
        return await sendGeneric({ to: normalizedTo, message, config: env });
      default:
        console.warn(`Unknown SMS provider "${provider}". Falling back to BulkSMSBD.`);
        return await sendBulkSMSBD({ to: normalizedTo, message, config: env });
    }
  } catch (error) {
    console.error(`[SMS Service Error - Provider: ${provider}]:`, error.message);
    // Safe fallback to mock in case of external network/gateway error
    return sendMockSMS({
      to: normalizedTo,
      message,
      reason: `Live provider dispath error (${error.message}). Falling back to mock.`,
    });
  }
};

/**
 * Send OTP via SMS
 */
const sendOtpSMS = async ({ to, otp }) => {
  const message = `Your KKIT verification code is: ${otp}. Valid for 15 minutes. Do not share this code with anyone.`;
  return sendSMS({ to, message });
};

/**
 * Send Enrollment Confirmation via SMS
 */
const sendEnrollmentSMS = async ({ to, courseTitle, studentName }) => {
  const nameStr = studentName ? `Dear ${studentName}, ` : "";
  const message = `${nameStr}congratulations! Your enrollment in "${courseTitle}" at KKIT has been confirmed. Happy learning!`;
  return sendSMS({ to, message });
};

/**
 * Send Service/Course Order Status Update via SMS
 */
const sendOrderSMS = async ({ to, orderNumber, status, totalAmount }) => {
  const amountStr = totalAmount ? ` (BDT ${totalAmount})` : "";
  const message = `KKIT Order Update: Order #${orderNumber}${amountStr} status is now: ${status.toUpperCase()}. Thank you for choosing KKIT.`;
  return sendSMS({ to, message });
};

module.exports = {
  sendSMS,
  sendOtpSMS,
  sendEnrollmentSMS,
  sendOrderSMS,
  normalizePhoneNumber,
};
