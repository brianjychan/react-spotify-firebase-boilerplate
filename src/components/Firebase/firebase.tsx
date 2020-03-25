import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}


class Firebase {
    auth: any
    db: any
    functions: any
    firestore: any

    constructor() {
        if (!app.apps.length) {
            app.initializeApp(config)
        }
        this.auth = app.auth()
        this.db = app.firestore()
        this.functions = app.functions()
        this.firestore = app.firestore
    }

    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email: string, password: string) =>
        this.auth.createUserWithEmailAndPassword(email, password)

    doSignInWithEmailAndPassword = (email: string, password: string) =>
        this.auth.signInWithEmailAndPassword(email, password)

    doSignOut = () => this.auth.signOut()

    doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email)

    doPasswordUpdate = (password: string) => this.auth.currentUser.updatePassword(password)

}

export { Firebase }
