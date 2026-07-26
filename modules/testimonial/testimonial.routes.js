const express = require("express");
const router = express.Router();
const testimonialController = require("./testimonial.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.get("/", testimonialController.getAllTestimonials);

router.use(protect);
router.post("/", testimonialController.createTestimonial);
router.put("/:id", authorize("super_admin", "admin"), testimonialController.updateTestimonial);
router.delete("/:id", authorize("super_admin", "admin"), testimonialController.deleteTestimonial);

module.exports = router;
