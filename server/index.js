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

const dbPath = path.join(__dirname, 'db.json');

function readDB() {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

app.post('/api/update-token', (req, res) => {
  const { token, user_id } = req.body;
  console.log(`Guardando token para el usuario: ${user_id}`);

  const db = readDB();
  db.userTokens[user_id] = token;
  writeDB(db);

  res.status(200).json({ message: 'Token actualizado correctamente', token, user_id });
});

app.get('/api/get-token/:user_id', (req, res) => {
  const { user_id } = req.params;

  const db = readDB();
  const token = db.userTokens[user_id];

  if (token) {
    console.log(`Token encontrado para el usuario: ${user_id}`);
    res.status(200).json({ token });
  } else {
    console.log(`Token no encontrado para el usuario: ${user_id}`);
    res.status(404).json({ message: 'Token no encontrado para el usuario proporcionado', user: user_id });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/amor/browser/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
