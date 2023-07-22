import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps, getApp } from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";

import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length < 1 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export const auth = getAuth();

export const storage = getStorage();

export const firebaseAnalytics =
  typeof window !== "undefined" && getAnalytics(app);

export default db;
