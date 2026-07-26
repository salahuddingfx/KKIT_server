const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const { getPartners, getPartnerById, createPartner, updatePartner, deletePartner } = require("./partner.controller");

router.get("/", getPartners);
router.get("/:id", getPartnerById);
router.post("/", protect, authorize("super_admin", "admin", "ceo", "md"), createPartner);
router.put("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), updatePartner);
router.delete("/:id", protect, authorize("super_admin", "admin", "ceo", "md"), deletePartner);

module.exports = router;
