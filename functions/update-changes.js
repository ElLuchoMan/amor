const db = require('./firebase-config');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Options Request' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { changes } = JSON.parse(event.body);
    const results = [];
    for (const change of changes) {
      const ref = await db.collection('changes').add({ change });
      results.push({ id: ref.id, change });
    }
    return { statusCode: 200, headers, body: JSON.stringify(results) };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error updating changes', error: error.message })
    };
  }
};
