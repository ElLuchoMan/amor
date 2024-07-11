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

    try {
        const { token, user_id } = JSON.parse(event.body);
        if (!token || !user_id) {
            throw new Error('Missing token or user_id');
        }

        const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

        const result = await client.query(
            q.Let(
                {
                    match: q.Match(q.Index('tokens_by_user_id'), user_id)
                },
                q.If(
                    q.Exists(q.Var('match')),
                    q.Update(
                        q.Select('ref', q.Get(q.Var('match'))),
                        { data: { token: token } }
                    ),
                    q.Create(q.Collection('tokens'), { data: { user_id: user_id, token: token } })
                )
            )
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Token actualizado correctamente' }),
        };
    } catch (error) {
        console.error('Error actualizando token:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Error actualizando token', error: error.message }),
        };
    }
};
