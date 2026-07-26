const express = require("express");
const router = express.Router();
const certificateController = require("./certificate.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.use(protect);

router.get("/", certificateController.getAllCertificates);
router.get("/:id", certificateController.getCertificateById);
router.post("/generate", authorize("super_admin", "admin", "mentor"), certificateController.generateCertificate);

module.exports = router;
