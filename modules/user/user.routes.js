const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");
const validate = require("../../middleware/validate");
const { updateUserSchema, changeRoleSchema } = require("./user.validation");

router.use(protect);

router.get("/", authorize("super_admin", "admin", "ceo", "md"), userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", validate(updateUserSchema), userController.updateUser);
router.delete("/:id", authorize("super_admin", "admin"), userController.deleteUser);
router.put("/:id/role", authorize("super_admin", "admin", "ceo", "md"), validate(changeRoleSchema), userController.changeUserRole);

module.exports = router;
