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

    try {
        const user_id = event.queryStringParameters.user_id;
        if (!user_id) {
            throw new Error('Missing user_id');
        }

        const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

        const result = await client.query(
            q.Let(
                {
                    match: q.Match(q.Index('tokens_by_user_id'), user_id)
                },
                q.If(
                    q.Exists(q.Var('match')),
                    q.Get(q.Var('match')),
                    null
                )
            )
        );

        if (result === null) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Token no encontrado para el usuario proporcionado', user: user_id }),
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ token: result.data.token }),
        };
    } catch (error) {
        console.error('Error recuperando token:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Error recuperando token', error: error.message }),
        };
    }
};
