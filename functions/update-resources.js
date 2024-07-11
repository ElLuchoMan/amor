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

    const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
    const resources = JSON.parse(event.body);

    try {
        const results = [];
        for (const resource of resources) {
            for (const [key, url] of Object.entries(resource)) {
                const result = await client.query(
                    q.Create(q.Collection('resources'), {
                        data: { type: key, url }
                    })
                );
                results.push({ id: result.ref.id, type: key, url: result.data.url });
            }
        }
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(results),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Error saving image URLs', error: error.message }),
        };
    }
};
