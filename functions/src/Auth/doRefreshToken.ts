import * as functions from 'firebase-functions'
import axios, { AxiosRequestConfig } from 'axios'
import * as querystring from 'querystring'

import { CLIENT_ID, CLIENT_SECRET, } from './config';
import { db, } from '../Firebase';
import { ApiProfile } from '../Types/UserProfile';

const INVALID_RESPONSE = { success: false }

const doRefreshTokenCF = functions.https.onCall(async (data, context) => {
    const uid = context.auth?.uid
    if (!uid) {
        return INVALID_RESPONSE
    }
    const functionCall = await doRefreshToken(uid)
    return functionCall
})

const doRefreshToken = async (uid: string) => {
    try {
        // Retrieve refresh token
        const apiData = (await db.collection('users').doc(uid).collection('sensitive').doc('api').get()).data() as ApiProfile
        const { accessToken, refreshToken, tokenExpiryMs } = apiData

        // If it's still valid, return the current accessToken
        if (Date.now() < tokenExpiryMs) {
            return { success: true, accessToken }
        }

        // Send refresh request to Spotify
        const urlEncodedData = {
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }
        const refreshRequestPayload: AxiosRequestConfig = {
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify(urlEncodedData),
            headers: {
                'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            }
        }
        const refreshResult = await axios.request(refreshRequestPayload)
        const { access_token, expires_in } = refreshResult.data

        // Save new access token
        const userApiData = {
            accessToken: access_token,
            tokenExpiryMs: Date.now() + (expires_in * 1000) - 10000
        }
        await db.collection('users').doc(uid).collection('sensitive').doc('api').update(userApiData)

        return { success: true, accessToken: access_token }

    } catch (error) {
        console.error('Refresh token error!')
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
}

export { doRefreshTokenCF, doRefreshToken }