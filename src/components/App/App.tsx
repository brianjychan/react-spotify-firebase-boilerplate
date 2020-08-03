import React, { useState, useEffect } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    Redirect,
} from "react-router-dom"
import * as querystring from 'query-string'

import { ROUTES, SPOTIFY_REDIRECT_URL, DEV_SPOTIFY_REDIRECT_URL } from '../../constants'
import { HomePage } from '../Home'
import { useFirebase } from '../Firebase'
import { useSession, SessionContext } from '../Session/'
import Button from 'react-bootstrap/Button';
import styles from './App.module.css'
import Spinner from 'react-bootstrap/Spinner'
import { SessionObject } from '../Session/useSession';
import { UserProfile } from '../Types/UserProfile';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const LoginWithCode: React.FC = () => {
    const query = useQuery()
    const firebase = useFirebase()

    const [loginFailed, setLoginFailed] = useState(false)

    useEffect(() => {
        const doLogin = async () => {
            const code = query.get('code')
            const devMode = process.env.NODE_ENV === 'development'

            if (!code) {
                return
            }

            const loginPayload = {
                code,
                devMode
            }
            const loginWithCode = firebase.functions.httpsCallable('loginWithCode')
            try {
                const result = await loginWithCode(loginPayload)
                const { success, customToken } = result.data
                if (success && customToken) {
                    firebase.auth.signInWithCustomToken(customToken)
                } else {
                    setLoginFailed(true)
                }
            }
            catch (error) {
                console.log(error)
            }
        }
        doLogin()
    }, [query, firebase])

    if (loginFailed) {
        return (
            <Redirect to={ROUTES.ROOT} />
        )
    }
    return (
        <div className={styles.window}>
            <Spinner animation="border" role="status" variant="success" />
            <p>Logging you in...</p>
        </div>
    )
}

const generateRandomString = function (length: number) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

const LoginScreen: React.FC = () => {
    const SPOTIFY_SCOPES = 'user-read-private user-read-email user-read-playback-state playlist-read-private playlist-read-collaborative'
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID
    const REDIRECT_URL = process.env.NODE_ENV === 'development' ? DEV_SPOTIFY_REDIRECT_URL : SPOTIFY_REDIRECT_URL

    const queryStringPayload = {
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SPOTIFY_SCOPES,
        redirect_uri: REDIRECT_URL,
        state: generateRandomString(16)
    }
    const spotifyLoginUrl = 'https://accounts.spotify.com/authorize?' + querystring.stringify(queryStringPayload)


    return (
        <div className={styles.window}>
            <Button href={spotifyLoginUrl} variant="success">Login with Spotify</Button>
        </div>
    )
}

const MainApp: React.FC = () => {
    const session = useSession()

    if (session.initializing) {
        return (<div />)
    }

    if (!session.auth?.uid) {
        return (
            <Router>
                <Switch>
                    <Route path={ROUTES.LOGIN_WITH_CODE}>
                        <LoginWithCode />
                    </Route>
                    <Route path={ROUTES.ROOT}>
                        <LoginScreen />
                    </Route>
                </Switch>
            </Router>
        )
    }

    // Authenticated
    return (
        <Router>
            <Switch>
                <Route path={ROUTES.ROOT}>
                    <HomePage />
                </Route>

            </Switch>
        </Router>
    )
}

// Provides App-Wide Context to access auth object
const AppWithAuth: React.FC = () => {
    const firebase = useFirebase()
    const [session, setSession] = useState<SessionObject>({
        initializing: true,
        auth: null,
        prof: null,
    } as SessionObject)

    useEffect(() => {
        // unsubscribe to the profile listener when unmounting
        let unsubscribeProfileDoc = () => { }

        function onChange(newUser: firebase.User | null) {
            if (newUser === null) {
                // Not authenticated
                setSession({ initializing: false, auth: null, prof: null })
                unsubscribeProfileDoc()
            } else {
                // New authentication occurred
                unsubscribeProfileDoc = firebase.db.collection('users').doc(newUser.uid).onSnapshot(async function (profileDoc) {
                    const profile = profileDoc.data() as UserProfile
                    setSession({ initializing: false, auth: newUser, prof: profile })
                }, (error) => {
                    console.error('Couldn\'t access profile')
                    setSession({ initializing: false, auth: newUser, prof: null })
                    console.log(error)
                })
            }
        }

        // listen for auth state changes
        const unsubscribe = firebase.auth.onAuthStateChanged(onChange)

        return () => {
            unsubscribeProfileDoc()
            unsubscribe()
        }
    }, [firebase])


    return (
        <SessionContext.Provider value={session}>
            <MainApp />
        </SessionContext.Provider>
    )
}

export { AppWithAuth }