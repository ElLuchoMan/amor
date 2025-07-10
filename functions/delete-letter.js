const db = require('../server/firebase');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'DELETE, GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Options Request' }) };
  }

  // Solo DELETE
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { id } = JSON.parse(event.body);
    if (!id) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'ID is required' }) };
    }

    await db.collection('letters').doc(id).delete();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Letter deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting letter:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error deleting letter', error: error.message }),
    };
  }
};
