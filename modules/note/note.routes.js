const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
} = require("./note.controller");

router.use(protect);

router.get("/", getNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.patch("/:id/pin", togglePin);

module.exports = router;
