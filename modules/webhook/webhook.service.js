const crypto = require("crypto");
const Webhook = require("./webhook.model");
const WebhookDelivery = require("./webhook-delivery.model");
const ApiError = require("../../utils/apiError");

const createWebhook = async (data, userId) => {
  return Webhook.create({ ...data, createdBy: userId });
};

const getWebhooks = async (userId) => {
  return Webhook.find({ createdBy: userId }).sort({ createdAt: -1 });
};

const getWebhookById = async (id) => {
  const webhook = await Webhook.findById(id);
  if (!webhook) throw ApiError.notFound("Webhook not found");
  return webhook;
};

const updateWebhook = async (id, data) => {
  const webhook = await Webhook.findByIdAndUpdate(id, data, { new: true });
  if (!webhook) throw ApiError.notFound("Webhook not found");
  return webhook;
};

const deleteWebhook = async (id) => {
  const webhook = await Webhook.findByIdAndDelete(id);
  if (!webhook) throw ApiError.notFound("Webhook not found");
};

const triggerWebhook = async (event, payload) => {
  const webhooks = await Webhook.find({
    active: true,
    events: event,
  });

  const results = [];

  for (const webhook of webhooks) {
    const startTime = Date.now();
    try {
      const signature = crypto
        .createHmac("sha256", webhook.secret)
        .update(JSON.stringify(payload))
        .digest("hex");

      const response = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Event": event,
        },
        body: JSON.stringify(payload),
      });

      const duration = Date.now() - startTime;
      const responseText = await response.text();

      await WebhookDelivery.create({
        webhook: webhook._id,
        event,
        payload,
        statusCode: response.status,
        response: responseText.substring(0, 1000),
        success: response.ok,
        duration,
      });

      webhook.lastTriggered = new Date();
      if (!response.ok) {
        webhook.failureCount += 1;
      } else {
        webhook.failureCount = 0;
      }
      await webhook.save();

      results.push({ webhookId: webhook._id, success: response.ok });
    } catch (error) {
      const duration = Date.now() - startTime;

      await WebhookDelivery.create({
        webhook: webhook._id,
        event,
        payload,
        success: false,
        error: error.message,
        duration,
      });

      webhook.failureCount += 1;
      await webhook.save();

      results.push({ webhookId: webhook._id, success: false, error: error.message });
    }
  }

  return results;
};

const getDeliveryLogs = async (webhookId, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    WebhookDelivery.find({ webhook: webhookId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    WebhookDelivery.countDocuments({ webhook: webhookId }),
  ]);

  return {
    logs,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  };
};

module.exports = {
  createWebhook,
  getWebhooks,
  getWebhookById,
  updateWebhook,
  deleteWebhook,
  triggerWebhook,
  getDeliveryLogs,
};
