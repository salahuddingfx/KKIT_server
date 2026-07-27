/**
 * Generic HTTP Gateway Provider Handler
 * Flexible fallback for custom SMS HTTP endpoints
 */
const sendGeneric = async ({ to, message, config }) => {
  const apiKey = config.SMS_API_KEY || "";
  const senderId = config.SMS_SENDER_ID || "";
  let url = config.SMS_API_URL;

  if (!url) {
    throw new Error("SMS_API_URL must be specified for generic provider.");
  }

  // Replace URL template variables if present
  url = url
    .replace("{to}", encodeURIComponent(to))
    .replace("{message}", encodeURIComponent(message))
    .replace("{api_key}", encodeURIComponent(apiKey))
    .replace("{sender_id}", encodeURIComponent(senderId));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiKey ? `Bearer ${apiKey}` : undefined,
    },
    body: JSON.stringify({
      to,
      message,
      senderId,
      apiKey,
    }),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = { raw: text };
  }

  if (response.ok) {
    return {
      success: true,
      provider: "generic",
      response: data,
    };
  }

  return {
    success: false,
    provider: "generic",
    error: text || "Generic SMS HTTP Gateway request failed",
    raw: data,
  };
};

module.exports = sendGeneric;
