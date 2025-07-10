const db = require('../server/firebase');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Options Request' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { token, user_id } = JSON.parse(event.body);
    if (!token || !user_id) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing token or user_id' }) };
    }
    await db.collection('tokens').doc(user_id).set({ token }, { merge: true });
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Token actualizado correctamente' }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Error actualizando token', error: error.message }) };
  }
};
