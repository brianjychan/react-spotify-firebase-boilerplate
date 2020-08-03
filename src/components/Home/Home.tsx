import React, { useState } from 'react'
import { useFirebase } from '../Firebase'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useSession } from '../Session'
import styles from './Home.module.css'
import { doRefreshToken } from '../Session/useSession'

const HomePage: React.FC = () => {
    const firebase = useFirebase()
    const session = useSession()

    const [text, setText] = useState('')

    const doSomething = async () => {
        // If we want to make a Spotify API request from the browser, we should check
        // if the accessToken has not expired yet 
        await doRefreshToken(firebase, session.prof)

        // Then contact the Spotify API here
        console.log(text)
    }
    

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
    }

    if (!session.auth || !session.prof) {
        return <div />
    }

    const { name, images } = session.prof
    const profImg = images[0].url

    return (
        <div className={styles.window}>
            <Row className={styles.navbar}>
                <Col xs={1}>
                    <img className={styles.profileImg} src={profImg} alt="profile from spotify" />
                </Col>
                <Col>
                    <h1>Logged in as {name}</h1>
                </Col>
                <Col xs={1}>
                    <Button variant="outline-success" onClick={() => { firebase.doSignOut() }}>Sign Out</Button>
                </Col>
            </Row>
            <div className={styles.userLinkBox}>
               <Row>
                    <Col xs={5}>
                        <input onChange={handleChange} className={styles.userLinkInput} />
                    </Col>
                    <Col xs="auto">
                        <Button variant="success" onClick={doSomething} className={styles.submitUserButton}>See their Music</Button>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export { HomePage }
