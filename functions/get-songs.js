const db = require('../server/firebase');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Options Request' }) };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const snap = await db.collection('songs').get();
    const songs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { statusCode: 200, headers, body: JSON.stringify({ songs }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Error fetching songs', error: error.message }) };
  }
};
