const express = require("express");
const router = express.Router();
const learningPathController = require("./learning-path.controller");
const { protect } = require("../../middleware/auth");
const { authorize } = require("../../middleware/role");

router.get("/", learningPathController.getAllPaths);
router.get("/:slug", learningPathController.getPathBySlug);

router.use(protect);
router.post("/", authorize("super_admin", "admin"), learningPathController.createPath);
router.put("/:id", authorize("super_admin", "admin"), learningPathController.updatePath);
router.delete("/:id", authorize("super_admin", "admin"), learningPathController.deletePath);

module.exports = router;
