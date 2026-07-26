const express = require("express");
const router = express.Router();
const pricingController = require("./pricing.controller");
const { protect, optionalAuth } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.get("/", optionalAuth, pricingController.getAllPricing);
router.get("/:id", optionalAuth, pricingController.getPricingById);

router.use(protect);
router.post("/", authorize("super_admin", "admin"), pricingController.createPricing);
router.put("/:id", authorize("super_admin", "admin"), pricingController.updatePricing);
router.delete("/:id", authorize("super_admin", "admin"), pricingController.deletePricing);

module.exports = router;
