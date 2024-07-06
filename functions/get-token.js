const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            },
            body: JSON.stringify({ message: 'Options Request' }),
        };
    }

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
        const { user_id } = event.queryStringParameters;
        const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

        const result = await client.query(
            q.Get(
                q.Ref(q.Collection('tokens'), user_id)
            )
        );

        const token = result.data.token;

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            },
            body: JSON.stringify({ token }),
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
