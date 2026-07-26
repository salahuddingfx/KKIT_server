const Note = require("./note.model");
const ApiError = require("../../utils/apiError");

const getNotes = async (userId, { course, lessonId }) => {
  const query = { user: userId };
  if (course) query.course = course;
  if (lessonId) query.lessonId = lessonId;

  const notes = await Note.find(query)
    .sort({ isPinned: -1, timestamp: 1, createdAt: 1 })
    .lean();

  return notes;
};

const getNoteById = async (id, userId) => {
  const note = await Note.findOne({ _id: id, user: userId }).lean();
  if (!note) throw ApiError.notFound("Note not found");
  return note;
};

const createNote = async (data) => {
  const note = await Note.create(data);
  return note;
};

const updateNote = async (id, userId, data) => {
  const note = await Note.findOneAndUpdate(
    { _id: id, user: userId },
    { content: data.content },
    { new: true }
  );
  if (!note) throw ApiError.notFound("Note not found");
  return note;
};

const deleteNote = async (id, userId) => {
  const note = await Note.findOneAndDelete({ _id: id, user: userId });
  if (!note) throw ApiError.notFound("Note not found");
  return note;
};

const togglePin = async (id, userId) => {
  const note = await Note.findById(id);
  if (!note || note.user.toString() !== userId.toString()) {
    throw ApiError.notFound("Note not found");
  }
  note.isPinned = !note.isPinned;
  await note.save();
  return note;
};

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote, togglePin };
