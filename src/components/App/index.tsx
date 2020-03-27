import React, { useState, useEffect, useContext, useCallback } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"

import { ROUTES } from '../../constants'
import { HomePage } from '../Home'
import { ProfilePage } from '../Profile'
import { useFirebase } from '../Firebase'
import { useSession, SessionContext } from '../Session/'

const MainApp: React.FC = () => {
    const session = useSession()

    if (session.initializing) {
        return (<div></div>)
    }
    return (
        <Router>
            <Switch>
                {/* <Route path={ROUTES.USERNAME}>
                    <ProfilePage />
                </Route> */}
                <Route path={ROUTES.ROOT}>
                    <HomePage />
                </Route>
            </Switch>
        </Router>
    )
}


const AppWithAuth: React.FC = () => {
    const firebase = useFirebase()
    const [authObject, setAuthObject] = useState(() => {
        const currentUser = firebase.auth.currentUser
        if (!currentUser) {
            return {
                initializing: true,
                auth: null,
            }
        } else {
            return {
                initializing: false,
                auth: currentUser,
            }
        }

    })

    useEffect(() => {
        function onChange(newUser: any) {
            console.log('New user detected in auth onChange: ', newUser)
            if (newUser === null) {
                // Not authenticated
                console.log('Not authenticated')
                setAuthObject({ initializing: false, auth: null })
            } else {
                // New authentication occurred
                setAuthObject(prevState => {
                    if (prevState.auth === null) {
                        // Went from unauthenticated to authenticated
                        console.log('Authenticated')
                        return { initializing: false, auth: newUser }
                    } else {
                        // Bug: Went from authenticated to another authentication
                        console.log('Bug: reauthenticated')
                        return prevState
                    }
                })
            }
        }

        // listen for auth state changes
        const unsubscribe = firebase.auth.onAuthStateChanged(onChange)
        // unsubscribe to the listener when unmounting

        return () => {
            unsubscribe()
            // We loaded a prof and were listening to it
        }
    }, [firebase.auth])

    return (
        <SessionContext.Provider value={authObject}>
            <MainApp />
        </SessionContext.Provider>
    )
}

const AppWithTwitter: React.FC = () => {
    const firebase = useFirebase()

    const getTwitterResult = useCallback(
        async () => {
            // If already logged in, no need to check
            if (firebase.auth.currentUser) {
                return
            }
            try {
                const result = await firebase.auth.getRedirectResult()
                console.log('Received Redirect result: ', result)
                const { user, additionalUserInfo, credential } = result
                if (!user) {
                    console.log('No Twitter Redirect Result!')
                    return
                }
                console.log('Current user after redirect: ', firebase.auth.currentUser)
                // Register user for first time
            }
            catch (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                console.log(error)
            }

        }, [firebase.auth])

    useEffect(() => {
        console.log('Current user in Twitter Checking Component: ', firebase.auth.currentUser)
        getTwitterResult()
    }, [getTwitterResult, firebase.auth])

    return (
        <AppWithAuth />
    )
}



export default AppWithTwitter 