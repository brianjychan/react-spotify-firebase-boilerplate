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
    auth: firebase.auth.Auth
    db: firebase.firestore.Firestore
    functions: firebase.functions.Functions
    provider: firebase.auth.AuthProvider

    constructor() {
        if (!app.apps.length) {
            app.initializeApp(config)
        }
        this.auth = app.auth()
        // For ease of access. Note that db normally refers to Firebase Realtime Database.
        this.db = app.firestore()
        this.functions = app.functions()
        this.provider = new app.auth.TwitterAuthProvider()
    }

    // *** Auth API ***

    // twitter signin handler
    doTwitterSignIn = async () => {
        this.auth.signInWithRedirect(this.provider)
    }

    // email and password signin handlers
    doCreateUserWithEmailAndPassword = (email: string, password: string) =>
        this.auth.createUserWithEmailAndPassword(email, password)

    doSignInWithEmailAndPassword = (email: string, password: string) =>
        this.auth.signInWithEmailAndPassword(email, password)

    doSignOut = () => this.auth.signOut()

}

export { Firebase}
