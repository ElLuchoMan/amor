const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Carga el archivo de cuenta de servicio
const serviceAccountPath = path.join(__dirname, 'service-account-file.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

const getAccessToken = async () => {
  try {
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/firebase.messaging']
    );

    const tokens = await jwtClient.authorize();
    return tokens.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

getAccessToken()
  .then(token => {
    console.log('Access Token:', token);
  })
  .catch(error => {
    console.error('Error getting access token:', error);
  });
