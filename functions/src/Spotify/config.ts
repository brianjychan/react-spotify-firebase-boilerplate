import * as functions from 'firebase-functions'

export const AUTH_CALLBACK_REDIRECT = '' // Cloud Function to receive the Spotify code
export const SITE_URL = '' // The URL of your web app that users should be redirected to after auth
export const CLIENT_ID = functions.config().spotify.id // Your Spotify Client ID
export const CLIENT_SECRET = functions.config().spotify.secret // Your Spotify Client Secret