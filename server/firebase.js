require("dotenv").config(); // solo en local, al inicio
const admin = require("firebase-admin");

// Configurar Firebase Admin
let serviceAccount;
let projectId;

try {
  // Intentar leer desde variables de entorno
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
  projectId = process.env.FIREBASE_PROJECT_ID;

  // Verificar que tenemos los datos necesarios
  if (!serviceAccount.project_id || !projectId) {
    throw new Error("Missing environment variables");
  }
} catch (error) {
  console.log(
    "⚠️  No se encontraron variables de entorno, usando firebase-admin-sdk.json..."
  );

  try {
    // Fallback: usar el archivo JSON directamente
    serviceAccount = require("../firebase-admin-sdk.json");
    projectId = serviceAccount.project_id;
  } catch (fileError) {
    console.error("❌ Error: No se pudo cargar la configuración de Firebase.");
    console.error(
      "   Por favor, asegúrate de tener un archivo .env con las variables correctas."
    );
    console.error(
      "   O verifica que el archivo firebase-admin-sdk.json exista."
    );
    process.exit(1);
  }
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: projectId,
  });
}

module.exports = admin.firestore();
