const env = require("../../config/env");

const createPayment = async (data) => {
  // Placeholder - implement with actual SSLCommerz SDK
  return {
    sessionkey: `ssl_${Date.now()}`,
    redirect_url: `${env.CLIENT_URL}/checkout/sslcommerz`,
    status: "pending",
  };
};

const validatePayment = (data) => {
  // Placeholder - implement actual validation
  return { valid: true, transactionId: data.tran_id };
};

module.exports = { createPayment, validatePayment };
