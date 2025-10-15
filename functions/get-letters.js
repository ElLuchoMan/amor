const db = require('./firebase-config');

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
    const snap = await db.collection('letters').orderBy('date').get();
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Error fetching letters', error: error.message }) };
  }
};
