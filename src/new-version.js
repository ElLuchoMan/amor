const admin = require('firebase-admin');
const serviceAccount = require('./path/to/firebase-admin-sdk.json');
const cron = require('node-cron');
const { SongsService } = require('./app/services/songs.service');

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

  admin.messaging().sendEachForMulticast(message)
    .then((response) => {
      console.log(response.successCount + ' mensajes enviados exitosamente');
    })
    .catch((error) => {
      console.log('Error enviando el mensaje:', error);
    });
};

sendNotification('Nueva versión disponible', 'Corre a ver los últimos cambios.');