const Note = require("../models/Note");
const { geminiTranscribe, geminiSummarize } = require("../utils/genai"); // gemini ai for transcript and summarize

const createNotes = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Audio file is required." });
    }

    const transcript = await geminiTranscribe(req.file.path);
    const note = await Note.create({
      audioUrl: req.file.path,
      transcript,
      summary: "",
      lastEdited: new Date(),
    });
    // console.log("code working")
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateNotes = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.transcript = req.body.transcript;
    note.summary = "";
    note.lastEdited = new Date();
    await note.save();

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteNotes = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const summarizeNotes = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    const summary = await geminiSummarize(note.transcript);
    note.summary = summary;
    await note.save();

    res.status(200).json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createNotes,
  getNotes,
  updateNotes,
  deleteNotes,
  summarizeNotes,
};
