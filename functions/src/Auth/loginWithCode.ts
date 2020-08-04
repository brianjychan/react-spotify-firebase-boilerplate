import * as functions from 'firebase-functions'
import axios, { AxiosRequestConfig } from 'axios'
import * as querystring from 'querystring'

import { CLIENT_ID, CLIENT_SECRET, SPOTIFY_REDIRECT_URL, DEV_SPOTIFY_REDIRECT_URL } from './config';
import { db, auth } from '../Firebase';

const loginWithCode = functions.https.onCall(async (data, context) => {
    // Check for error or code
    const { code, devMode } = data

    const redirectUri = devMode ? DEV_SPOTIFY_REDIRECT_URL : SPOTIFY_REDIRECT_URL

    try {
        // Retrieve access and refresh tokens
        const urlEncodedData = {
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        }
        const tokenExchangePayload: AxiosRequestConfig = {
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify(urlEncodedData),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            }
        }

        const tokenExchangeResult = await axios.request(tokenExchangePayload)
        const { access_token, refresh_token, expires_in } = tokenExchangeResult.data

        // Retrieve Spotify profile
        const retrieveIdPayload: AxiosRequestConfig = {
            method: 'GET',
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
        }
        const retrieveIdResult = (await axios.request(retrieveIdPayload)).data
        const { display_name, email, external_urls, id, images } = retrieveIdResult

        // Locate existing user profile in Firestore
        const existingUserQuery = await db.collection('users').where('id', '==', id).get()
        let uid = ''
        if (existingUserQuery.docs.length === 1) {
            uid = existingUserQuery.docs[0].data().uid
        } else if (existingUserQuery.docs.length === 0) {
            // User is authenticating for the first time
            // Create new user in Firebase
            const newUser = await auth.createUser({
                email,
                displayName: display_name,
            })
            uid = newUser.uid
        }

        // Update user profile
        const newProfileData = {
            uid,
            id,
            name: display_name,
            urls: external_urls,
            images,
        }
        await db.collection('users').doc(uid).set(newProfileData)

        // Save access tokens
        const userApiData = {
            uid,
            name: display_name,
            urls: external_urls,
            ...retrieveIdResult,
            accessToken: access_token,
            refreshToken: refresh_token,
            tokenExpiryMs: Date.now() + (expires_in * 1000) - 10000
        }
        await db.collection('users').doc(uid).collection('sensitive').doc('api').set(userApiData)

        // Generate a login token
        const customToken = await auth.createCustomToken(uid)
        return { success: true, customToken }

    } catch (error) {
        console.error('Login error!')
        console.log(error)
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
        return { success: false }
    }
})

export { loginWithCode }