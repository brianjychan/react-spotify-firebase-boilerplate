import * as functions from 'firebase-functions'
import axios, { AxiosRequestConfig } from 'axios'
import * as querystring from 'querystring'

import { AUTH_CALLBACK_REDIRECT, SITE_URL, CLIENT_ID, CLIENT_SECRET } from './config';
import { db, auth } from '../Firebase';

const spotifyAuth = functions.https.onRequest(async (req, res) => {
    // Check for error or code
    if (req.query.error) {
        console.log('Login Error')
        res.redirect('https://spotify.com/')
    }
    const code = req.query.code || null

    // TODO: what does this do
    res.clearCookie('__session')

    try {
        // Retrieve access and refresh tokens
        const urlEncodedData = {
            code: code,
            redirect_uri: AUTH_CALLBACK_REDIRECT,
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        }
        const tokenExchangePayload: AxiosRequestConfig = {
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify(urlEncodedData),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            },
        }

        const tokenExchangeResult = await axios.request(tokenExchangePayload)
        const { access_token, refresh_token } = tokenExchangeResult.data
        console.log('token exchange result: ')
        console.log(tokenExchangeResult)

        // Retrieve Spotify profile
        const retrieveIdPayload: AxiosRequestConfig = {
            method: 'GET',
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
        }

        const retrieveIdResult = (await axios.request(retrieveIdPayload)).data
        const { display_name, email, external_urls, id, images } = retrieveIdResult

        // TODO: how to check if user already has created their profile?
        const existingUserQuery = await db.collection('users').where('id', '==', id).get()
        let redirectSiteUrl = SITE_URL
        if (existingUserQuery.docs.length === 1) {
            // User already exists

            // Add `devMode = true` on your user document to reroute to localhost in dev
            const isInDevMode = existingUserQuery.docs[0].data().devMode
            if (isInDevMode) {
                redirectSiteUrl = 'http://localhost:3000'
            }
        } else if (existingUserQuery.docs.length === 0) {
            // User is authenticating for the first time
            // Create new user in Firebase
            const newUser = await auth.createUser({
                email,
                displayName: display_name,
            })
            const { uid } = newUser

            // Create new user profile
            const newProfileData = {
                uid,
                id,
                name: display_name,
                urls: external_urls,
                images,
            }
            await db.collection('users').doc(uid).set(newProfileData)

            // Save access tokens
            const newTokenData = {
                ...retrieveIdResult,
                accessToken: access_token,
                refreshToken: refresh_token
            }
            await db.collection('users').doc(uid).collection('sensitive').doc('api').set(newTokenData)
        }

        // Pass tokens to browser
        res.redirect(redirectSiteUrl + '?' +
            querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
            })
        )

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
        res.redirect(SITE_URL)
    }
})

export { spotifyAuth }