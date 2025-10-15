const admin = require('firebase-admin');

// Configuración para Netlify Functions - solo usa variables de entorno
let serviceAccount;
let projectId;

try {
  // Obtener credenciales desde variables de entorno de Netlify
  if (!process.env.FIREBASE_SERVICE_ACCOUNT || !process.env.FIREBASE_PROJECT_ID) {
    throw new Error('Missing required environment variables: FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID');
  }

  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  projectId = process.env.FIREBASE_PROJECT_ID;

  console.log('🔧 Firebase configurado con variables de entorno de Netlify');
  console.log('📝 Project ID:', projectId);

} catch (error) {
  console.error('❌ Error configurando Firebase:', error.message);
  throw error;
}

// Inicializar Firebase Admin solo si no está ya inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: projectId
  });
}

module.exports = admin.firestore();
