import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import lyricsFinder from 'lyrics-finder';
import SpotifyWebApi from 'spotify-web-api-node';
import favoritesRouter from './favorites/favorites.router.js';

export const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
app.get('/ping', (_req, res) => res.send('Pong'));

app.use('/favorites', favoritesRouter);

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi ({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    })

    spotifyApi
    .refreshAccessToken()
    .then((data) => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in,
            })
        }).catch(() => {
            res.sendStatus(400)
        })
})


app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi ({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    })
    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refresh_token: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
    .catch(() => {
        res.sendStatus(400)
    })
});

app.get('/lyrics', async (req, res) => {
const lyrics = (await lyricsFinder(req.query.artist, req.query.track)) ||
"No lyrics found"
res.json({lyrics})
})
