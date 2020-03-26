import * as admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});
const db = admin.firestore();
const messaging = admin.messaging()

export { db, messaging }