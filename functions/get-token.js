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
    const user_id = event.queryStringParameters && event.queryStringParameters.user_id;
    if (!user_id) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'User ID is required' }) };
    }

    const doc = await db.collection('tokens').doc(user_id).get();
    if (!doc.exists) {
      return { statusCode: 404, headers, body: JSON.stringify({ message: 'Token not found for provided user', user: user_id }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ token: doc.data().token }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Error retrieving token', error: error.message }) };
  }
};
