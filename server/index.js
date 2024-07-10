const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist/amor/browser')));

const tokensPath = path.join(__dirname, 'tokens.json');
const songsPath = path.join(__dirname, 'songs.json');
const textPath = path.join(__dirname, 'text.json');
const resourcesPath = path.join(__dirname, 'resources.json');

function readJSON(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

app.post('/api/update-token', (req, res) => {
  const { token, user_id } = req.body;
  console.log(`Guardando token para el usuario: ${user_id}`);

  const db = readJSON(tokensPath);
  db.userTokens[user_id] = token;
  writeJSON(tokensPath, db);

  res.status(200).json({ message: 'Token actualizado correctamente' });
});

app.get('/api/get-token', (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const db = readJSON(tokensPath);
  const token = db.userTokens[user_id];

  if (token) {
    console.log(`Token encontrado para el usuario: ${user_id}`);
    res.status(200).json({ token });
  } else {
    console.log(`Token no encontrado para el usuario: ${user_id}`);
    res.status(404).json({ message: 'Token no encontrado para el usuario proporcionado', user: user_id });
  }
});

app.get('/api/get-songs', (req, res) => {
  const songs = readJSON(songsPath);
  res.json(songs);
});

app.get('/api/get-text', (req, res) => {
  const text = readJSON(textPath);
  res.json(text);
});

app.get('/api/get-resources', (req, res) => {
  const resources = readJSON(resourcesPath);
  res.json(resources);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/amor/browser/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
