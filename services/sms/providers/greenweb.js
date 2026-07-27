/**
 * Greenweb BD Provider Handler
 * Docs: https://greenweb.com.bd
 */
const sendGreenweb = async ({ to, message, config }) => {
  const token = config.SMS_API_KEY;
  const url = config.SMS_API_URL || "https://api.greenweb.com.bd/api.php";

  if (!token || token === "your_sms_api_key_here") {
    throw new Error("Greenweb SMS Token/API Key is missing in SMS configuration.");
  }

  const params = new URLSearchParams({
    token: token,
    to: to,
    message: message,
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = { raw: text };
  }

  if (response.ok && (!data.status || data.status === "Ok" || text.includes("Ok"))) {
    return {
      success: true,
      provider: "greenweb",
      response: data,
    };
  }

  return {
    success: false,
    provider: "greenweb",
    error: data.message || text || "Failed to send Greenweb SMS",
    raw: data,
  };
};

module.exports = sendGreenweb;
