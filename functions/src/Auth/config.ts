import * as functions from 'firebase-functions'

export const CLIENT_ID = functions.config().spotify.id // Your Spotify Client ID
export const CLIENT_SECRET = functions.config().spotify.secret // Your Spotify Client Secret

export const SPOTIFY_REDIRECT_URL = 'https://mysite.com/loginWithCode' // The URL of your web app that users should be redirected to after completing spotify Auth
export const DEV_SPOTIFY_REDIRECT_URL = 'http://localhost:3000/loginWithCode' // The dev version of the above