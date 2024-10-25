import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as serviceAccount from "./admin.json"

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(JSON.stringify(serviceAccount))),
  storageBucket: process.env.FIREBASE_STORAGEBUCKET
});

export const db = admin.firestore();

export const storageBucket = admin.storage().bucket();