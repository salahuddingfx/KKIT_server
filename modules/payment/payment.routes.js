const express = require("express");
const router = express.Router();
const paymentController = require("./payment.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

// Webhook (unauthenticated)
router.post("/webhook/:provider", paymentController.handleWebhook);

router.use(protect);

// User routes
router.get("/", paymentController.getAllPayments);
router.post("/", paymentController.createPayment);
router.get("/:id", paymentController.getPaymentById);

// Admin routes
router.put("/:id/confirm", authorize("super_admin", "admin", "finance"), paymentController.confirmPayment);
router.put("/:id/cancel", authorize("super_admin", "admin", "finance"), paymentController.cancelPayment);
router.put("/:id/refund", authorize("super_admin", "admin", "finance"), paymentController.refundPayment);

module.exports = router;
