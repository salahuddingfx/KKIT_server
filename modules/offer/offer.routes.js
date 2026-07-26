const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const {
  getOffers, getActiveOffers, getOfferById,
  createOffer, updateOffer, deleteOffer, validateCoupon,
} = require("./offer.controller");

router.get("/active", getActiveOffers);
router.post("/validate-coupon", validateCoupon);
router.get("/", getOffers);
router.get("/:id", getOfferById);
router.post("/", protect, authorize("super_admin", "admin", "ceo", "md"), createOffer);
router.put("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), updateOffer);
router.delete("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), deleteOffer);

module.exports = router;
