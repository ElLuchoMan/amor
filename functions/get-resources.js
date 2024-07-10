const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
  const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

  try {
    const result = await client.query(q.Get(q.Ref(q.Collection('resources'), 'resources')));
    return {
      statusCode: 200,
      body: JSON.stringify(result.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching resources', error: error.message }),
    };
  }
};
