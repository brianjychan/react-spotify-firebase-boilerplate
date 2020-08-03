import * as admin from 'firebase-admin';

admin.initializeApp()
const auth = admin.auth()
const db = admin.firestore();
const messaging = admin.messaging()

export { auth, db, messaging }