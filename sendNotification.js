const fetch = require('node-fetch');
const { google } = require('googleapis');
const serviceAccount = require('./service-account-file.json'); // Reemplaza con la ruta correcta al archivo JSON

const getAccessToken = async () => {
  const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/firebase.messaging']
  );

  const tokens = await jwtClient.authorize();
  return tokens.access_token;
};

const sendNotification = async (token, deviceToken, message) => {
  const response = await fetch('https://fcm.googleapis.com/v1/projects/natyalejo-d82e2/messages:send', { // Reemplaza YOUR_PROJECT_ID con el ID de tu proyecto
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        token: deviceToken,
        notification: message,
      },
    }),
  });

  const data = await response.json();
  console.log('Notification sent:', data);
};

const main = async () => {
  try {
    const accessToken = await getAccessToken();
    const deviceToken = 'dCLZ7G8bchBcEPxQzzx3Lh:APA91bEuYdhcqH21Qq1uXatMMRHbs5kBjz4It-CJSPXhqNQZWc-YCU3IrF2LOUg-g5pqAZe7SnloM0y_pHvojmD8HTKCJ-H_BgpZ9pqFNsX0snW0ZgxUTABJMqWEurbDrjn0LeXegVf5'; // Reemplaza con el token del dispositivo que obtuviste
    const message = {
      title: 'HOLA!',
      body: 'Esto es una prueba',
      image: 'https://master--amornatyalejo.netlify.app/assets/logo.png'
    };

    await sendNotification(accessToken, deviceToken, message);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

main();
