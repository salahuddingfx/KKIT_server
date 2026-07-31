const { sendGA4ServerEvent } = require("./ga4MP.service");

/**
 * Unified Server-Side Tracking Hub
 */
const trackServerEvent = async (eventName, params = {}, userId = null, clientId = null) => {
  try {
    // 1. Dispatch to GA4 Measurement Protocol
    const result = await sendGA4ServerEvent({
      eventName,
      params,
      userId,
      clientId,
    });

    return result;
  } catch (err) {
    console.error(`[Server Tracking Hub Error] ${eventName}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Convenience helpers for standard events
 */

// Purchase event
const trackServerPurchase = (data) => {
  return trackServerEvent(
    "purchase",
    {
      transaction_id: String(data.transactionId || data.paymentId),
      value: Number(data.amount || 0),
      currency: data.currency || "BDT",
      item_name: data.courseTitle || "Course",
      payment_method: data.method || "manual",
    },
    data.userId
  );
};

// Sign Up event
const trackServerSignUp = (data) => {
  return trackServerEvent(
    "sign_up",
    {
      method: data.method || "email_otp",
    },
    data.userId
  );
};

// Lead event
const trackServerLead = (data) => {
  return trackServerEvent(
    "generate_lead",
    {
      lead_type: data.leadType || "contact",
      subject: data.subject || "",
    },
    data.userId
  );
};

module.exports = {
  trackServerEvent,
  trackServerPurchase,
  trackServerSignUp,
  trackServerLead,
};
