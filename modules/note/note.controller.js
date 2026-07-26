const noteService = require("./note.service");
const catchAsync = require("../../utils/catchAsync");

const getNotes = catchAsync(async (req, res) => {
  const notes = await noteService.getNotes(req.user._id, req.query);
  res.status(200).json({ success: true, data: notes });
});

const createNote = catchAsync(async (req, res) => {
  const note = await noteService.createNote({
    ...req.body,
    user: req.user._id,
  });
  res.status(201).json({ success: true, data: note });
});

const updateNote = catchAsync(async (req, res) => {
  const note = await noteService.updateNote(req.params.id, req.user._id, req.body);
  res.status(200).json({ success: true, data: note });
});

const deleteNote = catchAsync(async (req, res) => {
  await noteService.deleteNote(req.params.id, req.user._id);
  res.status(200).json({ success: true, message: "Note deleted" });
});

const togglePin = catchAsync(async (req, res) => {
  const note = await noteService.togglePin(req.params.id, req.user._id);
  res.status(200).json({ success: true, data: note });
});

module.exports = { getNotes, createNote, updateNote, deleteNote, togglePin };
