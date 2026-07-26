const express = require("express");
const router = express.Router();
const serviceOrderController = require("./service-order.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.use(protect);

router.post("/", serviceOrderController.createOrder);
router.get("/my-orders", serviceOrderController.getMyOrders);

// Admin / Staff routes
router.get("/", authorize("super_admin", "admin", "ceo", "md", "support"), serviceOrderController.getAllOrders);
router.get("/:id", serviceOrderController.getOrderById);
router.put("/:id/status", authorize("super_admin", "admin", "ceo", "md", "support"), serviceOrderController.updateOrderStatus);

module.exports = router;
