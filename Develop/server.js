const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON request body
app.use(express.json());
// Middleware for serving static files
app.use(express.static('public'));

// Helper function to read notes from db.json
const readNotesFromFile = () => {
  const filePath = path.join(__dirname, 'db', 'db.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write notes to db.json
const writeNotesToFile = (notes) => {
  const filePath = path.join(__dirname, 'Develop', 'db.json');
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
};



// GET /api/notes - Get all notes
app.get('/api/notes', (req, res) => {
  const notes = readNotesFromFile();
  res.json(notes);
});

// POST /api/notes - Create a new note
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  const newNote = { id: Math.random().toString(36).substr(2, 9), title, text };
  const notes = readNotesFromFile();
  notes.push(newNote);
  writeNotesToFile(notes);
  res.json(newNote);
});

// DELETE /api/notes/:id - Delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  let notes = readNotesFromFile();
  notes = notes.filter(note => note.id !== id);
  writeNotesToFile(notes);
  res.json({ message: 'Note deleted successfully' });
});

// HTML route to serve notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// HTML route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});