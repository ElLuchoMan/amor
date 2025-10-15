// server/index.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const db = require("./firebase"); // exporta admin.firestore()

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../dist/amor/browser")));

const PORT = process.env.PORT || 3000;

// — Tokens —
// Guarda o actualiza el token de un usuario
app.post("/api/update-token", async (req, res) => {
  try {
    const { token, user_id } = req.body;
    await db.collection("tokens").doc(user_id).set({ token }, { merge: true });
    res.status(200).json({ message: "Token actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar token" });
  }
});

// Obtiene el token de un usuario
app.get("/api/get-token", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id)
      return res.status(400).json({ message: "User ID is required" });

    const doc = await db.collection("tokens").doc(user_id).get();
    if (!doc.exists)
      return res.status(404).json({ message: "Token no encontrado" });

    res.json({ token: doc.data().token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al leer token" });
  }
});

// — Songs —
// Devuelve todas las canciones
app.get("/api/get-songs", async (req, res) => {
  try {
    const snap = await db.collection("songs").get();
    const songs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al leer songs" });
  }
});

// Reemplaza todas las canciones (borrando y volcando las nuevas)
app.post("/api/update-songs", async (req, res) => {
  try {
    const { songs } = req.body;
    const batch = db.batch();

    // 1) borra las existentes
    const existing = await db.collection("songs").get();
    existing.docs.forEach((doc) => batch.delete(doc.ref));

    // 2) añade las nuevas
    songs.forEach((song) => {
      const ref = db.collection("songs").doc();
      batch.set(ref, song);
    });

    await batch.commit();
    res.json({ message: "Songs updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar songs" });
  }
});

// — Text —
// Devuelve todos los textos
app.get("/api/get-text", async (req, res) => {
  try {
    const snap = await db.collection("text").get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al leer text" });
  }
});

// — Resources —
// Devuelve todos los recursos
app.get("/api/get-resources", async (req, res) => {
  try {
    const snap = await db.collection("resources").get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al leer resources" });
  }
});

// Reemplaza todos los recursos
app.post("/api/update-resources", async (req, res) => {
  try {
    const resources = req.body;
    const batch = db.batch();
    const existing = await db.collection("resources").get();
    existing.docs.forEach((doc) => batch.delete(doc.ref));
    resources.forEach((item) => {
      const ref = db.collection("resources").doc();
      batch.set(ref, item);
    });
    await batch.commit();
    res.json({ message: "Resources updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar resources" });
  }
});

// — Changes —
// Devuelve todos los cambios
app.get("/api/get-changes", async (req, res) => {
  try {
    const snap = await db.collection("changes").get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al leer changes" });
  }
});

// Reemplaza todos los cambios
app.post("/api/update-changes", async (req, res) => {
  try {
    const { changes } = req.body;
    const batch = db.batch();
    const existing = await db.collection("changes").get();
    existing.docs.forEach((doc) => batch.delete(doc.ref));
    changes.forEach((item) => {
      const ref = db.collection("changes").doc();
      batch.set(ref, item);
    });
    await batch.commit();
    res.json({ message: "Changes updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar changes" });
  }
});

// — Letters (Local File) —
// Devuelve todas las cartas desde el archivo local
app.get("/api/get-letters", (req, res) => {
  try {
    const fs = require("fs");
    const lettersData = JSON.parse(
      fs.readFileSync("./server/letters.json", "utf8")
    );
    // Agregar ID único para cada carta basado en el índice
    const lettersWithId = lettersData.map((letter, index) => ({
      id: `letter_${index}`,
      ...letter,
    }));
    res.json(lettersWithId);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al leer letters del archivo local" });
  }
});

// Agrega una carta nueva al archivo local
app.post("/api/add-letter", (req, res) => {
  try {
    const fs = require("fs");
    let data = req.body;

    // Normalizar estructura: si viene anidada como {letter: {...}}, aplanarla
    if (data.letter && typeof data.letter === "object") {
      console.log("📝 Estructura anidada detectada, normalizando...");
      data = data.letter; // Extraer el contenido de 'letter'
    }

    // Formatear fecha si no viene
    if (!data.date) {
      const now = new Date();
      data.date = `${now.getDate().toString().padStart(2, "0")}/${(
        now.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${now.getFullYear()}`;
    }

    // Leer cartas existentes
    const lettersData = JSON.parse(
      fs.readFileSync("./server/letters.json", "utf8")
    );

    // Crear objeto carta con estructura normalizada
    const normalizedLetter = {
      date: data.date,
      image: data.image,
      text: data.text,
    };

    // Agregar video si existe
    if (data.video) {
      normalizedLetter.video = data.video;
    }

    // Agregar nueva carta normalizada
    lettersData.push(normalizedLetter);

    // Guardar archivo actualizado
    fs.writeFileSync(
      "./server/letters.json",
      JSON.stringify(lettersData, null, 2)
    );

    console.log("📧 Nueva carta agregada localmente:", normalizedLetter.date);
    console.log("🔧 Estructura normalizada:", normalizedLetter);
    res.json({
      message: "Letter added successfully to local file",
      id: `letter_${lettersData.length - 1}`,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al agregar letter al archivo local" });
  }
});

// Elimina una carta por ID del archivo local
app.delete("/api/delete-letter", (req, res) => {
  try {
    const fs = require("fs");
    const { id } = req.body;

    // Extraer índice del ID (formato: letter_0, letter_1, etc.)
    const index = parseInt(id.replace("letter_", ""));

    // Leer cartas existentes
    const lettersData = JSON.parse(
      fs.readFileSync("./server/letters.json", "utf8")
    );

    // Verificar que el índice sea válido
    if (index >= 0 && index < lettersData.length) {
      // Eliminar la carta
      lettersData.splice(index, 1);

      // Guardar archivo actualizado
      fs.writeFileSync(
        "./server/letters.json",
        JSON.stringify(lettersData, null, 2)
      );

      console.log("🗑️ Carta eliminada localmente, índice:", index);
      res.json({ message: "Letter deleted successfully from local file" });
    } else {
      res.status(404).json({ message: "Letter not found" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al borrar letter del archivo local" });
  }
});

// Actualiza una carta por ID en el archivo local
app.put("/api/update-letter", (req, res) => {
  try {
    const fs = require("fs");
    const { id, updates } = req.body;

    // Extraer índice del ID
    const index = parseInt(id.replace("letter_", ""));

    // Leer cartas existentes
    const lettersData = JSON.parse(
      fs.readFileSync("./server/letters.json", "utf8")
    );

    // Verificar que el índice sea válido
    if (index >= 0 && index < lettersData.length) {
      // Actualizar la carta
      lettersData[index] = { ...lettersData[index], ...updates };

      // Guardar archivo actualizado
      fs.writeFileSync(
        "./server/letters.json",
        JSON.stringify(lettersData, null, 2)
      );

      console.log("✏️ Carta actualizada localmente, índice:", index);
      res.json({ message: "Letter updated successfully in local file" });
    } else {
      res.status(404).json({ message: "Letter not found" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al actualizar letter en archivo local" });
  }
});

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist/amor/browser/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
