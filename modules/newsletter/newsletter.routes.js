const express = require("express");
const router = express.Router();
const newsletterController = require("./newsletter.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.post("/", newsletterController.subscribe);

router.use(protect);
router.get("/", authorize("super_admin", "admin"), newsletterController.getAllSubscribers);
router.delete("/:id", authorize("super_admin", "admin"), newsletterController.unsubscribe);

module.exports = router;
