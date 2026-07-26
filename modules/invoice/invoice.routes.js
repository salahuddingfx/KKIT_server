const express = require("express");
const router = express.Router();
const invoiceController = require("./invoice.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.use(protect);

router.get("/", authorize("super_admin", "admin", "finance"), invoiceController.getAllInvoices);
router.post("/", authorize("super_admin", "admin", "finance"), invoiceController.createInvoice);
router.get("/:id", invoiceController.getInvoiceById);
router.get("/:id/pdf", invoiceController.downloadPDF);

module.exports = router;
