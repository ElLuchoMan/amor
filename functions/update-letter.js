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

    if (event.httpMethod !== 'PUT') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

    try {
        const { date, newLetter } = JSON.parse(event.body);

        const result = await client.query(
            q.Update(
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(q.Index("letters_by_date"), date)
                    )
                ),
                { data: newLetter }
            )
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Letter updated successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Error updating letter', error: error.message }),
        };
    }
};
