/**
 * Twilio Provider Handler
 * Docs: https://www.twilio.com/docs/sms
 */
const sendTwilio = async ({ to, message, config }) => {
  const accountSid = config.SMS_USERNAME || config.SMS_API_KEY;
  const authToken = config.SMS_PASSWORD;
  const fromNumber = config.SMS_SENDER_ID;

  if (!accountSid || !authToken || accountSid === "your_sms_api_key_here") {
    throw new Error("Twilio Account SID or Auth Token missing in SMS configuration.");
  }

  const url = config.SMS_API_URL || `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const authHeader = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;

  const body = new URLSearchParams({
    To: to.startsWith("+") ? to : `+${to}`,
    From: fromNumber,
    Body: message,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": authHeader,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await response.json();

  if (response.ok && data.sid) {
    return {
      success: true,
      provider: "twilio",
      response: data,
    };
  }

  return {
    success: false,
    provider: "twilio",
    error: data.message || "Failed to send Twilio SMS",
    raw: data,
  };
};

module.exports = sendTwilio;
