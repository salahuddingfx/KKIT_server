/**
 * Mock SMS Provider Handler
 * Logs SMS details to console during development or when live credentials are not set.
 */
const sendMockSMS = async ({ to, message, reason }) => {
  console.log("========================================");
  console.log("📱 [SMS SERVICE - MOCK MODE]");
  console.log(`To:      ${to}`);
  console.log(`Message: ${message}`);
  if (reason) console.log(`Notice:  ${reason}`);
  console.log("Timestamp:", new Date().toISOString());
  console.log("========================================");

  return {
    success: true,
    provider: "mock",
    mock: true,
    message: "SMS logged to console (Mock Mode Active)",
    deliveredTo: to,
    content: message,
  };
};

module.exports = sendMockSMS;
