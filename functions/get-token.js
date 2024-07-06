const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            },
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        const user_id = event.queryStringParameters.user_id;
        if (!user_id) {
            throw new Error('Missing user_id');
        }

        const client = new faunadb.Client({ secret: 'fnAFlqySWtAAQgxz9uNHjgDxeXWN8rQ1WMpk03WB' });

        const result = await client.query(
            q.Get(q.Ref(q.Collection('tokens'), user_id))
        );

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            },
            body: JSON.stringify({ token: result.data.token }),
        };
    } catch (error) {
        console.error('Error recuperando token:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            },
            body: JSON.stringify({ message: 'Error recuperando token', error: error.message }),
        };
    }
};
