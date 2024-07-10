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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

  const songs = JSON.parse(event.body).songs;

  try {
    const result = await client.query(
      q.Map(
        songs,
        q.Lambda(
          "song",
          q.Create(
            q.Collection('songs'),
            { data: q.Var("song") }
          )
        )
      )
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Songs added successfully', result }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error adding songs', error: error.message }),
    };
  }
};
