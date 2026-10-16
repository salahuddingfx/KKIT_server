const express = require("express");
const router = express.Router();
const subscriptionController = require("./subscription.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.use(protect);

router.get("/my", subscriptionController.getMySubscription);
router.get("/", subscriptionController.getUserSubscriptions);
router.post("/", subscriptionController.createSubscription);
router.post("/:id/cancel", subscriptionController.cancelSubscription);
router.post("/:id/pause", subscriptionController.pauseSubscription);
router.post("/:id/resume", subscriptionController.resumeSubscription);

router.get(
  "/admin/all",
  authorize("super_admin", "admin", "finance"),
  subscriptionController.getAllSubscriptions
);

module.exports = router;
