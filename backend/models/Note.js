const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    audioUrl: { type: String, required: true },
    transcript: { type: String, default: "" },
    summary: { type: String, default: "" },
    lastEdited: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
