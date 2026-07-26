const express = require("express");
const router = express.Router();
const faqController = require("./faq.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.get("/", faqController.getAllFaqs);

router.use(protect);
router.post("/", authorize("super_admin", "admin", "support"), faqController.createFaq);
router.put("/:id", authorize("super_admin", "admin", "support"), faqController.updateFaq);
router.delete("/:id", authorize("super_admin", "admin", "support"), faqController.deleteFaq);

module.exports = router;