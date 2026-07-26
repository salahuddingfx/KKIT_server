const express = require("express");
const router = express.Router();
const adminController = require("./admin.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.use(protect);
router.use(authorize("super_admin", "admin", "ceo", "md", "finance"));

router.get("/stats", adminController.getStats);
router.get("/recent", adminController.getRecent);
router.get("/overview", adminController.getOverview);
router.get("/users", adminController.getAllUsers);
router.put("/users/:id/status", adminController.updateUserStatus);
router.get("/reports", adminController.getReports);

module.exports = router;
