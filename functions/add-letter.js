const db = require('../server/firebase');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Options Request' }) };
  }

  // Solo POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { letter } = JSON.parse(event.body);

    // Si quieres añadir una fecha automática:
    if (!letter.date) letter.date = new Date().toISOString();

    const ref = await db.collection('letters').add(letter);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ id: ref.id, letter }),
    };
  } catch (error) {
    console.error('Error adding letter:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error adding letter', error: error.message }),
    };
  }
};
