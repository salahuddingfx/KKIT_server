const express = require("express");
const router = express.Router();
const contactController = require("./contact.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.post("/", contactController.createContact);

router.use(protect);
router.get("/", authorize("super_admin", "admin", "support"), contactController.getAllContacts);
router.get("/:id", authorize("super_admin", "admin", "support"), contactController.getContactById);
router.put("/:id", authorize("super_admin", "admin", "support"), contactController.updateContact);
router.delete("/:id", authorize("super_admin", "admin"), contactController.deleteContact);

module.exports = router;
