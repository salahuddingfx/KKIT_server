/**
 * BulkSMSBD Provider Handler
 * Docs: https://bulksmsbd.net / http://api.bulksmsbd.net
 */
const sendBulkSMSBD = async ({ to, message, config }) => {
  const apiKey = config.SMS_API_KEY;
  const senderId = config.SMS_SENDER_ID || "KKIT";
  const url = config.SMS_API_URL || "https://api.bulksmsbd.net/smsapi";

  if (!apiKey || apiKey === "your_sms_api_key_here") {
    throw new Error("BulkSMSBD API Key is missing in SMS configuration.");
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    type: "text",
    number: to,
    senderid: senderId,
    message: message,
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = { raw: text };
  }

  if (response.ok && (data.response_code === 200 || data.response_code === 1001 || text.includes("SMS Submitted"))) {
    return {
      success: true,
      provider: "bulksmsbd",
      response: data,
    };
  }

  return {
    success: false,
    provider: "bulksmsbd",
    error: data.message || data.response_code || text || "Failed to send BulkSMSBD SMS",
    raw: data,
  };
};

module.exports = sendBulkSMSBD;
