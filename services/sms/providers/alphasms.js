/**
 * AlphaSMS Provider Handler
 * Docs: https://alphasms.biz
 */
const sendAlphaSMS = async ({ to, message, config }) => {
  const apiKey = config.SMS_API_KEY;
  const url = config.SMS_API_URL || "https://api.alphasms.biz/smsapi";

  if (!apiKey || apiKey === "your_sms_api_key_here") {
    throw new Error("AlphaSMS API Key is missing in SMS configuration.");
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    number: to,
    msg: message,
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    method: "GET",
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = { raw: text };
  }

  if (response.ok && (data.error === 0 || text.includes("OK") || text.includes("Success"))) {
    return {
      success: true,
      provider: "alphasms",
      response: data,
    };
  }

  return {
    success: false,
    provider: "alphasms",
    error: data.msg || text || "Failed to send AlphaSMS",
    raw: data,
  };
};

module.exports = sendAlphaSMS;
