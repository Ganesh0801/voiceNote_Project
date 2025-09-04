const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db.js");
const notesRouter = require("./routes/noteRoutes");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());//is a middleware setup in an Express.js application that parses incoming requests with JSON payloads.
app.use("/uploads", express.static("uploads")); //Allows easy serving of uploaded files or other static assets without writing custom routes for each file.

app.use("/notes", notesRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
