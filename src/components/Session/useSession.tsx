import { createContext, useContext } from 'react'
import firebase from 'firebase'
import { ApiProfile } from '../Types/UserProfile';
import { Firebase } from '../Firebase';
import axios, { AxiosRequestConfig } from 'axios'

export interface SessionObject {
    initializing: boolean,
    auth: firebase.User | null,
    prof: ApiProfile,
    refreshMode: -1 | 0 | 1, // -1 = invalid token and currently refreshing, 0 = TBD (while loading), 1 = valid token
}

const doRefreshToken = async (firebase: Firebase, profile: ApiProfile) => {
    const { tokenExpiryMs, accessToken } = profile

    if (Date.now() < tokenExpiryMs) {
        return { valid: true }
    }
    const accessCheckPayload: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }
    let requestFailed = false
    try {
        await axios.request(accessCheckPayload)
        return { valid: true }
    } catch (error) {
        console.log(error)
        requestFailed = true
    }
    if (requestFailed) {
        try {
            // Request Failed. Request new refresh token
            const refreshTokenFunc = firebase.functions.httpsCallable('doRefreshToken')
            await refreshTokenFunc()
            return { valid: true }

        } catch (error) {
            console.log(error)
        }
    }
}

const SessionContext = createContext<SessionObject>({
    auth: null,
    initializing: true,
    prof: {} as ApiProfile,
    refreshMode: 0
})

const useSession: () => SessionObject = () => {
    const session = useContext(SessionContext)
    return session
}

export { SessionContext, useSession, doRefreshToken }

