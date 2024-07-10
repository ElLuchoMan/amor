const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Options Request' }),
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

  try {
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('resources'))),
        q.Lambda('ref', q.Get(q.Var('ref')))
      )
    );

    const data = result.data.map(item => item.data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error fetching resources', error: error.message }),
    };
  }
};
