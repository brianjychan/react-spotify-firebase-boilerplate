import * as functions from 'firebase-functions'

export const CLIENT_ID = functions.config().spotify.id // Your Spotify Client ID
export const CLIENT_SECRET = functions.config().spotify.secret // Your Spotify Client Secret

export const AUTH_CALLBACK_REDIRECT = 'https://mysite.com/loginWithCode' // The URL of your web app that users should be redirected to after authorizing with Spotify
export const DEV_AUTH_CALLBACK_REDIRECT = 'http://localhost:3000/loginWithCode' // The dev version of the above