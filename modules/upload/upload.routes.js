const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { uploadAny } = require("../../middleware/upload");
const { uploadSingle, uploadMultipleFiles, deleteSingle, deleteMultipleFiles } = require("./upload.controller");

// Upload a single image/file (supports any field name: file, image, avatar, photo, etc.)
router.post("/single", protect, uploadAny(), uploadSingle);
router.post("/image", protect, uploadAny(), uploadSingle);

// Upload multiple images/files (max 10)
router.post("/multiple", protect, uploadAny(), uploadMultipleFiles);

// Delete a single file by filename/publicId
router.delete("/:filename", protect, deleteSingle);

// Delete multiple files
router.post("/delete-multiple", protect, deleteMultipleFiles);

module.exports = router;
