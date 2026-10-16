const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/apiResponse");
const webhookService = require("./webhook.service");

const createWebhook = catchAsync(async (req, res) => {
  const webhook = await webhookService.createWebhook(req.body, req.user._id);
  ApiResponse.created(res, webhook, "Webhook created");
});

const getWebhooks = catchAsync(async (req, res) => {
  const webhooks = await webhookService.getWebhooks(req.user._id);
  ApiResponse.success(res, webhooks);
});

const getWebhookById = catchAsync(async (req, res) => {
  const webhook = await webhookService.getWebhookById(req.params.id);
  ApiResponse.success(res, webhook);
});

const updateWebhook = catchAsync(async (req, res) => {
  const webhook = await webhookService.updateWebhook(req.params.id, req.body);
  ApiResponse.success(res, webhook, "Webhook updated");
});

const deleteWebhook = catchAsync(async (req, res) => {
  await webhookService.deleteWebhook(req.params.id);
  ApiResponse.noContent(res);
});

const testWebhook = catchAsync(async (req, res) => {
  const results = await webhookService.triggerWebhook("test", {
    message: "Test webhook",
    timestamp: new Date(),
  });
  ApiResponse.success(res, results);
});

const getDeliveryLogs = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await webhookService.getDeliveryLogs(req.params.id, {
    page: parseInt(page),
    limit: parseInt(limit),
  });
  ApiResponse.success(res, result);
});

module.exports = {
  createWebhook,
  getWebhooks,
  getWebhookById,
  updateWebhook,
  deleteWebhook,
  testWebhook,
  getDeliveryLogs,
};
