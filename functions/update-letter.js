const db = require('./firebase-config');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Options Request' }) };
  }

  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { id, updates } = JSON.parse(event.body);
    if (!id) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'ID is required' }) };
    }
    await db.collection('letters').doc(id).update(updates);
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Letter updated successfully' }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Error updating letter', error: error.message }) };
  }
};
