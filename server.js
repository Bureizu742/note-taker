//requires
const express = require('express');
const fs = require('fs');
const path = require('path');

//port, express init, and database require
const PORT = process.env.PORT || 3001;
const app = express();
const notesDB = require('./db/db.json');

//allows the public directory to be read
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//get paths
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
app.get('/api/notes', (req, res) => res.json(notesDB));

//post path
app.post('/api/notes', (req, res) => {
    const dbPath = path.join(__dirname, "/db/db.json");
    const newNote = req.body;
    let highID = 99;
    
    for (let i = 0; i < notesDB.length; i++) {
        const notes = notesDB[i];

        if (notes.id > highID) highID = notes.id;
    }

    newNote.id = highID + 1;
    notesDB.push(newNote);

    fs.writeFile(dbPath, JSON.stringify(notesDB, null, 2), (err) => {
        if (err) console.log(err);
        console.log("Your note was saved!");
    });
    res.json(newNote);
});

//logs a message to let the user know the app is listening
app.listen(PORT, function () {
    console.log(`App listening on http://localhost:${PORT}`);
});