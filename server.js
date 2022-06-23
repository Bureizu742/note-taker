const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

const notesDB = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
// app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
// app.get('/api/notes', (req, res) => res.json(notesDB));


const uniqueID = () => {
    Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

//stuff

// Setup notes variable
fs.readFile("db/db.json", "utf8", (err, data) => {

    if (err) throw err;

    var notes = JSON.parse(data);

    // API ROUTES
    // ========================================================

    // Setup the /api/notes get route
    app.get("/api/notes", function (req, res) {
        // Read the db.json file and return all saved notes as JSON.
        res.json(notes);
    });

    // Setup the /api/notes post route
    app.post("/api/notes", function (req, res) {
        // Receives a new note, adds it to db.json, then returns the new note
        let newNote = req.body;
        notes.push(newNote);
        updateDb();
        return console.log("Added new note: " + newNote.title);
    });

    // Retrieves a note with specific id
    app.get("/api/notes/:id", function (req, res) {
        // display json for the notes array indices of the provided id
        res.json(notes[req.params.id]);
    });

    // Deletes a note with specific id
    app.delete("/api/notes/:id", function (req, res) {
        notes.splice(req.params.id, 1);
        updateDb();
        console.log("Deleted note with id " + req.params.id);
    });

    // VIEW ROUTES
    // ========================================================

    // Display notes.html when /notes is accessed
    app.get('/notes', function (req, res) {
        res.sendFile(path.join(__dirname, "./public/notes.html"));
    });

    // Display index.html when all other routes are accessed
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, "./public/index.html"));
    });

    //updates the json file whenever a note is added or deleted
    function updateDb() {
        fs.writeFile("db/db.json", JSON.stringify(notes, '\t'), err => {
            if (err) throw err;
            return true;
        });
    }

});

app.listen(PORT, function () {
    console.log(`App listening on http://localhost:${PORT}`);
});