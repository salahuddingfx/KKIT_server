const axios = require("axios");

/**
 * GA4 Measurement Protocol Server-Side Dispatcher
 * Docs: https://developers.google.com/analytics/devguides/collection/protocol/ga4
 */
const sendGA4ServerEvent = async ({
  eventName,
  params = {},
  userId = null,
  clientId = null,
}) => {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  const effectiveClientId = clientId || (userId ? String(userId) : `server.${Date.now()}.${Math.random().toString(36).substring(2, 9)}`);

  const payload = {
    client_id: effectiveClientId,
    user_id: userId ? String(userId) : undefined,
    events: [
      {
        name: eventName,
        params: {
          engagement_time_msec: "100",
          session_id: String(Date.now()),
          ...params,
        },
      },
    ],
  };

  if (!measurementId || !apiSecret) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[GA4 Measurement Protocol - Dev Mode Log] Event: ${eventName}`, JSON.stringify(payload, null, 2));
    }
    return { success: true, mode: "dev_log" };
  }

  try {
    const url = `https://www.google-analytics.com/mp/collect?api_secret=${apiSecret}&measurement_id=${measurementId}`;
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });

    if (process.env.NODE_ENV === "development") {
      console.log(`[GA4 Measurement Protocol - Dispatched] ${eventName} (Status: ${response.status})`);
    }

    return { success: true, status: response.status };
  } catch (error) {
    console.error(`[GA4 Measurement Protocol Error] Failed to send ${eventName}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendGA4ServerEvent };
