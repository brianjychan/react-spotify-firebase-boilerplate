import * as functions from 'firebase-functions'
import { AUTH_CALLBACK_REDIRECT , CLIENT_ID} from './config'
import * as querystring from 'querystring'

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length: number) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}


const login = functions.https.onRequest((req, res) => {
    const state = generateRandomString(16)
    res.set('Set-Cookie', `__session=${state};`)

    const scope = 'user-read-private user-read-email user-read-playback-state playlist-read-private playlist-read-collaborative'
    const queryStringPayload = {
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: AUTH_CALLBACK_REDIRECT,
        state: state
    }
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify(queryStringPayload))
})

export { login }