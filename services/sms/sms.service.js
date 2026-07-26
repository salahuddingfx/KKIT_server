const sendSMS = async ({ to, message }) => {
  // Placeholder - integrate with your SMS provider (Twilio, etc.)
  console.log(`SMS to ${to}: ${message}`);
  return { success: true, message: "SMS sent successfully" };
};

module.exports = { sendSMS };
