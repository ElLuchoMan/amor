const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

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
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: projectId
  });
}

module.exports = getFirestore();
