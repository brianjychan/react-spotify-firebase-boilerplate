import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

import TimeAgo from 'javascript-time-ago'
// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'

// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en)

export interface TimestampMap {
    '_seconds': number;
    '_nanoseconds': number;
    'seconds': number;
    'nanoseconds': number;
}

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
    timeAgo: TimeAgo


    constructor() {
        if (!app.apps.length) {
            app.initializeApp(config)
        }
        this.auth = app.auth()
        // For ease of access. Note that db normally refers to Firebase Realtime Database.
        this.db = app.firestore()
        this.functions = app.functions()
        this.provider = new app.auth.TwitterAuthProvider()
        this.timeAgo = new TimeAgo('en-US')
    }

    // *** Auth API ***
    doSignOut = () => this.auth.signOut()

    getTimeText = (timeObject: any) => {
        // Convert to time text once it's of type firestore.Timestamp
        const getTextFromTimestamp = (timestamp: app.firestore.Timestamp) => {
            if (timestamp instanceof app.firestore.Timestamp) {
                return this.timeAgo.format(timestamp.toDate())
            } else {
                return 'some time ago'
            }

        }
        // console.log(Object.prototype.toString.call(timeObject) === '[object Object]')
        if (timeObject instanceof app.firestore.Timestamp) {
            // Check if Timestamp (accessed from client SDK)
            return getTextFromTimestamp(timeObject)
        } else if (Object.prototype.toString.call(timeObject) === '[object Object]') {
            // Check if it's a Map (JSON serialized from Cloud Functions)
            const timestamp = this.getTimestampFromMap(timeObject)
            if (timestamp) {
                return getTextFromTimestamp(timestamp)
            }
        }
        // Fallback
        console.log('Couldn\'t parse time. It is of type: ' + (typeof timeObject))
        console.log(timeObject)
        return 'some time ago'
    }

    getTimestampDifference = (laterTime: app.firestore.Timestamp, earlierTime: app.firestore.Timestamp) => {
        const msDifference = laterTime.toMillis() - earlierTime.toMillis()
        return msDifference
    }

    getTimestampFromMap = (timeMap: TimestampMap) => {
        if (timeMap instanceof app.firestore.Timestamp) {
            throw new Error('Object is a timestamp, not a map')
        }
        const keyArr = Object.keys(timeMap)
        if (keyArr.includes('_seconds') && keyArr.includes('_nanoseconds')) {
            let seconds = timeMap['_seconds']
            let nanoseconds = timeMap['_nanoseconds']
            const timestamp = new app.firestore.Timestamp(seconds, nanoseconds)
            return timestamp
        } else {
            console.error('Expected TimeMap keys not present')
            return null
        }
    }
}

export { Firebase }
