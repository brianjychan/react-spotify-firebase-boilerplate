import React from 'react'
import { useFirebase, Firebase } from '../Firebase'
import { Button } from 'react-bootstrap'
import { useSession } from '../Session'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { useEffect } from 'react';


const HomePage: React.FC = () => {
    const firebase = useFirebase()
    const session = useSession()
    const history = useHistory()

    useEffect(() => {
        if (session.auth) {
            firebase.firestore().collection('prof').doc(session.auth.uid)
        }
    }, [firebase, session])
    console.log()
    if (session.auth) {
        return (
            <div>
                <p>Home</p>
                <p>Logged in!</p>
                <Button variant="info" onClick={() => { firebase.doSignOut() }}>Sign Out</Button>

            </div>
        )
    } else {
        return (
            <div>
                <p>Home</p>
                <Button variant="info" onClick={() => { firebase.doTwitterSignIn() }}>Sign In to Twitter</Button>
            </div>
        )
    }
}

export { HomePage }
