const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.Faunadb_SECRET });

exports.handler = async (event) => {
  try {
    const user_id = event.path.split("/").pop();

    const response = await client.query(
      q.Get(q.Match(q.Index("user_by_id"), user_id))
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ token: response.data.token }),
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Token no encontrado para el usuario proporcionado', error: error.message }),
    };
  }
};
