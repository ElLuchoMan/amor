const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { token, user_id } = JSON.parse(event.body);
    if (!token || !user_id) {
      throw new Error('Missing token or user_id');
    }

    const client = new faunadb.Client({ secret: 'YOUR_FAUNADB_SECRET' });

    const result = await client.query(
      q.Update(
        q.Ref(q.Collection('tokens'), user_id),
        { data: { token: token } }
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Token actualizado correctamente', token, user_id }),
    };
  } catch (error) {
    console.error('Error actualizando token:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error actualizando token', error: error.message }),
    };
  }
};
