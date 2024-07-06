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

getAccessToken().then(token => {
  console.log('Access Token:', token);
}).catch(error => {
  console.error('Error getting access token:', error);
});
