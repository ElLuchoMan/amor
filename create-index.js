const faunadb = require('faunadb');
const q = faunadb.query;

const client = new faunadb.Client({ secret: 'fnAFlqySWtAAQgxz9uNHjgDxeXWN8rQ1WMpk03WB' });

client.query(
    q.CreateIndex({
        name: 'tokens_by_user_id',
        source: q.Collection('tokens'),
        terms: [{ field: ['data', 'user_id'] }]
    })
).then((ret) => console.log(ret))
    .catch((err) => console.error('Error creating index:', err));
