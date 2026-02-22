const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const app = express();

const CLIENT_ID = '1383451217317072969';
const CLIENT_SECRET = 'd7QUVjtooqN3mDnaobtzkmpzbodXq_pm';
const REDIRECT_URI = 'http://localhost:3000/callback';

app.get('/', (req, res) => {
    res.send('<a href="/login">Login with Discord</a>');
});

app.get('/login', (req, res) => {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify email`;
    res.redirect(url);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) return res.send("No code provided");

    try {
        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',
            qs.stringify({
                client_id: 1383451217317072969,
                client_secret: d7QUVjtooqN3mDnaobtzkmpzbodXq_pm,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
                scope: 'identify email'
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get(
            'https://discord.com/api/users/@me',
            {
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );

        const user = userResponse.data;

        res.send(`
            <h1>Welcome ${user.username}</h1>
            <p>ID: ${user.id}</p>
            <p>Email: ${user.email}</p>
        `);

    } catch (err) {
        console.error(err.response?.data || err);
        res.send("Authentication Failed");
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});