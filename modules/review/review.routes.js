const express = require("express");
const router = express.Router();
const reviewController = require("./review.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getReviewById);

router.use(protect);
router.post("/", reviewController.createReview);
router.put("/:id", authorize("super_admin", "admin"), reviewController.updateReview);
router.delete("/:id", authorize("super_admin", "admin"), reviewController.deleteReview);

module.exports = router;
