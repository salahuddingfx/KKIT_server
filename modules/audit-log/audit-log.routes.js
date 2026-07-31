const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const ctrl = require("./audit-log.controller");

router.use(protect);
router.use(authorize("super_admin", "admin", "ceo", "md"));

router.get("/", ctrl.getLogs);
router.get("/stats", ctrl.getStats);

module.exports = router;
