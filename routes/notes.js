const note = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("../helpers/fsUtils");

// GET Route for retrieving all the notes
note.get("/", (req, res) =>
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
);

// DELETE Route for a specific note
note.delete("/:id", (req, res) => {
  console.log("DELETE");
  const noteId = req.params.id;
  console.log(noteId);
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile("./db/db.json", result);

      // Respond to the DELETE request
      res.status(200).json(`Item ${noteId} has been deleted 🗑️`);
    });
});

// POST Route for a new UX/UI note
note.post("/", (req, res) => {
  const { title, text } = req.body;
  console.log("body", req.body);

  if (req.body) {
    const newTip = {
      title,
      text,
      id: uuidv4(),
    };

    console.log("Tip", newTip);
    readAndAppend(newTip, "./db/db.json");
    res.json(`Tip added successfully 🚀`);
  } else {
    res.error("Error in adding note");
  }
});

module.exports = note;
