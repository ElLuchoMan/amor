const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const { token, user_id } = data;

    const response = await client.query(
      q.Update(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("user_by_id"), user_id))
        ),
        { data: { token: token } }
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Token actualizado correctamente', token, user_id }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Error actualizando token', error: error.message }),
    };
  }
};
