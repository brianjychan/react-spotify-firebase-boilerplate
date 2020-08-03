import React from 'react'
import { useFirebase } from '../Firebase'
import { Button } from 'react-bootstrap'
import { useSession } from '../Session'
import styles from './Home.module.css'

const HomePage: React.FC = () => {
    const firebase = useFirebase()
    const session = useSession()

    if (!session.auth) {
        return <div />
    }

    return (
        <div className={styles.window}>
            <p>Logged in</p>
            <Button variant="success" onClick={() => { firebase.doSignOut() }}>Sign Out</Button>
        </div>
    )
}

export { HomePage }
