const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const ctrl = require("./site-setting.controller");

router.use(protect);
router.use(authorize("super_admin", "admin", "ceo", "md"));

router.get("/", ctrl.getAll);
router.get("/:key", ctrl.getByKey);
router.put("/:key", ctrl.setByKey);
router.put("/", ctrl.bulkUpdate);
router.delete("/:key", ctrl.deleteKey);

module.exports = router;
