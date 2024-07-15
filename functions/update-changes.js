const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Options Request' }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const client = new faunadb.Client({ secret: process.env.Faunadb_SECRET });
  const { changes } = JSON.parse(event.body);

  try {
    const results = [];
    for (const change of changes) {
      const result = await client.query(
        q.Create(q.Collection('changes'), {
          data: { change }
        })
      );
      results.push({ id: result.ref.id, change: result.data.change });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error updating changes', error: error.message }),
    };
  }
};
