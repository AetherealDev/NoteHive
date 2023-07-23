const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const DBPATH = path.join(__dirname, '/db/db.json');
// Middleware for parsing JSON in request body
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// API route to get all notes from db.json
app.get('/api/notes', (req, res) => {
    fs.readFile(DBPATH, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error reading notes data' });
        }
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

// API route to add a new note to db.json
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error reading notes data' });
        }

        const notes = JSON.parse(data);
        const lastNoteId = notes.length > 0 ? notes[notes.length - 1].id : 0;
        newNote.id = lastNoteId + 1;
        notes.push(newNote);

        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error saving note' });
            }
            res.json(newNote);
        });
    });
});


// Bonus: DELETE route to delete a note by id
app.delete('/api/notes/:id', (req, res) => {
    const idToDelete = parseInt(req.params.id);
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error reading notes data' });
        }

        const notes = JSON.parse(data);
        const updatedNotes = notes.filter((note) => note.id !== idToDelete);

        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(updatedNotes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error deleting note' });
            }
            res.json({ message: 'Note deleted successfully' });
        });
    });
});



// HTML route to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// HTML route to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
