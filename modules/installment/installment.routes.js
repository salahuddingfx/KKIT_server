const express = require("express");
const router = express.Router();
const installmentController = require("./installment.controller");
const { protect } = require("../../middleware/auth");

router.use(protect);

router.get("/", installmentController.getMyInstallments);
router.get("/:id", installmentController.getInstallmentById);
router.post("/", installmentController.createPlan);
router.post("/:id/pay/:installmentNumber", installmentController.payInstallment);

module.exports = router;
