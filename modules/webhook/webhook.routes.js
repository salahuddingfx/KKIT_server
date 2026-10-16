const express = require("express");
const router = express.Router();
const webhookController = require("./webhook.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.use(protect);
router.use(authorize("super_admin", "admin"));

router.get("/", webhookController.getWebhooks);
router.post("/", webhookController.createWebhook);
router.get("/:id", webhookController.getWebhookById);
router.put("/:id", webhookController.updateWebhook);
router.delete("/:id", webhookController.deleteWebhook);
router.post("/:id/test", webhookController.testWebhook);
router.get("/:id/logs", webhookController.getDeliveryLogs);

module.exports = router;
