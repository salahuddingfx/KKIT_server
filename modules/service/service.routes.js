const express = require("express");
const router = express.Router();
const serviceController = require("./service.controller");
const { protect, optionalAuth } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.get("/", optionalAuth, serviceController.getAllServices);
router.get("/:slug", optionalAuth, serviceController.getServiceBySlug);

router.use(protect);
router.post("/", authorize("super_admin", "admin"), serviceController.createService);
router.put("/:id", authorize("super_admin", "admin"), serviceController.updateService);
router.delete("/:id", authorize("super_admin", "admin"), serviceController.deleteService);

module.exports = router;
