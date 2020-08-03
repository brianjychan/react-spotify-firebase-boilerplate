import React from 'react'
import { useFirebase } from '../Firebase'
import { Button } from 'react-bootstrap'
import { useSession } from '../Session'
import styles from './Home.module.css'

const HomePage: React.FC = () => {
    const firebase = useFirebase()
    const session = useSession()

    if (!session.auth || !session.prof) {
        return <div />
    }

    const { name, images } = session.prof
    const profImg = images[0].url
    return (
        <div className={styles.window}>
            <p>Logged in</p>
            <p>Hello, {name}!</p>
            <img src={profImg} alt="profile from spotify" />
            <br />
            <Button variant="success" onClick={() => { firebase.doSignOut() }}>Sign Out</Button>
        </div>
    )
}

export { HomePage }
