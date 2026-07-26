const env = require("../../config/env");

const createPayment = async (data) => {
  // Placeholder - implement with actual BKash API
  return {
    payment_id: `bk_${Date.now()}`,
    bkash_url: `${env.CLIENT_URL}/checkout/bkash`,
    status: "pending",
  };
};

const executePayment = async (paymentId) => {
  // Placeholder - implement actual execution
  return { transactionStatus: "Completed", transactionId: paymentId };
};

module.exports = { createPayment, executePayment };
