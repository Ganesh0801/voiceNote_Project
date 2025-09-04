const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  createNotes,
  getNotes,
  updateNotes,
  deleteNotes,
  summarizeNotes,
} = require("../controllers/noteControllers.js");

router.post("/create", upload.single("audio"), createNotes);
router.get("/getAll", getNotes);
router.put("/:id", updateNotes);
router.delete("/:id", deleteNotes);
router.post("/:id/summarize", summarizeNotes);

module.exports = router;
