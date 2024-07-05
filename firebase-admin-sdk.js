const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin-sdk.json');
const cron = require('node-cron');
const { SongsService } = require('./src/app/services/songs.service');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const songsService = new SongsService();
const tokens = songsService.tokenFCM;

const sendNotification = (title, body) => {
  const messages = tokens.map(token => {
    return {
      token: token,
      notification: {
        title: title,
        body: body
      }
    };
  });

  admin.messaging().sendEach(messages)
    .then((response) => {
      console.log(response.successCount + ' mensajes enviados exitosamente');
    })
    .catch((error) => {
      console.log('Error enviando el mensaje:', error);
    });
};


cron.schedule('0 12 * * *', () => {
  sendNotification('Hola', 'Solo quería desearte un feliz almuerzo');
});

// Tarea para enviar notificación en la noche
cron.schedule('0 20 * * *', () => {
  sendNotification('Buenas noches', 'Espero que descanses mucho y duermas bien, sueña lindo.');
});

// Ejemplo de tarea personalizada durante el día
cron.schedule('0 15 * * *', () => {
  sendNotification('Recordatorio', 'No olvides que a pesar de estar ocupado, te amo demasiasdo');
});

console.log('Tareas programadas configuradas.');
