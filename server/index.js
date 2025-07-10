// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const db = require('./firebase'); // exporta admin.firestore()

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist/amor/browser')));

const PORT = process.env.PORT || 3000;

// — Tokens —
// Guarda o actualiza el token de un usuario
app.post('/api/update-token', async (req, res) => {
  try {
    const { token, user_id } = req.body;
    await db.collection('tokens').doc(user_id).set({ token }, { merge: true });
    res.status(200).json({ message: 'Token actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar token' });
  }
});

// Obtiene el token de un usuario
app.get('/api/get-token', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: 'User ID is required' });

    const doc = await db.collection('tokens').doc(user_id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Token no encontrado' });

    res.json({ token: doc.data().token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al leer token' });
  }
});

// — Songs —
// Devuelve todas las canciones
app.get('/api/get-songs', async (req, res) => {
  try {
    const snap = await db.collection('songs').get();
    const songs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al leer songs' });
  }
});

// Reemplaza todas las canciones (borrando y volcando las nuevas)
app.post('/api/update-songs', async (req, res) => {
  try {
    const { songs } = req.body;
    const batch = db.batch();

    // 1) borra las existentes
    const existing = await db.collection('songs').get();
    existing.docs.forEach(doc => batch.delete(doc.ref));

    // 2) añade las nuevas
    songs.forEach(song => {
      const ref = db.collection('songs').doc();
      batch.set(ref, song);
    });

    await batch.commit();
    res.json({ message: 'Songs updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar songs' });
  }
});

// — Text —
// Devuelve todos los textos
app.get('/api/get-text', async (req, res) => {
  try {
    const snap = await db.collection('text').get();
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al leer text' });
  }
});

// — Resources —
// Devuelve todos los recursos
app.get('/api/get-resources', async (req, res) => {
  try {
    const snap = await db.collection('resources').get();
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al leer resources' });
  }
});

// Reemplaza todos los recursos
app.post('/api/update-resources', async (req, res) => {
  try {
    const resources = req.body;
    const batch = db.batch();
    const existing = await db.collection('resources').get();
    existing.docs.forEach(doc => batch.delete(doc.ref));
    resources.forEach(item => {
      const ref = db.collection('resources').doc();
      batch.set(ref, item);
    });
    await batch.commit();
    res.json({ message: 'Resources updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar resources' });
  }
});

// — Changes —
// Devuelve todos los cambios
app.get('/api/get-changes', async (req, res) => {
  try {
    const snap = await db.collection('changes').get();
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al leer changes' });
  }
});

// Reemplaza todos los cambios
app.post('/api/update-changes', async (req, res) => {
  try {
    const { changes } = req.body;
    const batch = db.batch();
    const existing = await db.collection('changes').get();
    existing.docs.forEach(doc => batch.delete(doc.ref));
    changes.forEach(item => {
      const ref = db.collection('changes').doc();
      batch.set(ref, item);
    });
    await batch.commit();
    res.json({ message: 'Changes updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar changes' });
  }
});

// — Letters —
// Devuelve todas las cartas
app.get('/api/get-letters', async (req, res) => {
  try {
    const snap = await db.collection('letters').orderBy('date').get();
    const letters = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(letters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al leer letters' });
  }
});

// Agrega una carta nueva
app.post('/api/add-letter', async (req, res) => {
  try {
    const data = req.body;
    if (!data.date) data.date = new Date().toISOString();
    const ref = await db.collection('letters').add(data);
    res.json({ message: 'Letter added successfully', id: ref.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al agregar letter' });
  }
});

// Elimina una carta por ID
app.delete('/api/delete-letter', async (req, res) => {
  try {
    const { id } = req.body;
    await db.collection('letters').doc(id).delete();
    res.json({ message: 'Letter deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al borrar letter' });
  }
});

// Actualiza una carta por ID
app.put('/api/update-letter', async (req, res) => {
  try {
    const { id, updates } = req.body;
    await db.collection('letters').doc(id).update(updates);
    res.json({ message: 'Letter updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar letter' });
  }
});

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/amor/browser/index.html'));
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
