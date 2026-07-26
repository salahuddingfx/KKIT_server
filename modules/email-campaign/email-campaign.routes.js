const express = require("express");
const router = express.Router();
const emailCampaignController = require("./email-campaign.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.use(protect);

const adminRoles = ["super_admin", "admin", "ceo", "md"];

router.get("/", authorize(...adminRoles), emailCampaignController.getAllCampaigns);
router.get("/:id", authorize(...adminRoles), emailCampaignController.getCampaignById);
router.get("/:id/stats", authorize(...adminRoles), emailCampaignController.getCampaignStats);
router.post("/", authorize(...adminRoles), emailCampaignController.createCampaign);
router.put("/:id", authorize(...adminRoles), emailCampaignController.updateCampaign);
router.delete("/:id", authorize(...adminRoles), emailCampaignController.deleteCampaign);
router.post("/:id/send", authorize(...adminRoles), emailCampaignController.sendCampaign);

module.exports = router;
