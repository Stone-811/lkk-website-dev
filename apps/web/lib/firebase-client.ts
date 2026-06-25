import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase client configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase Client SDK
function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  return initializeApp(firebaseConfig);
}

// Get Auth instance (client-side)
export function getClientAuth(): Auth {
  const app = getFirebaseApp();
  return getAuth(app);
}

// Get Firestore instance (client-side)
export function getClientDb(): Firestore {
  const app = getFirebaseApp();
  return getFirestore(app);
}

// Get Storage instance (client-side)
export function getClientStorage(): FirebaseStorage {
  const app = getFirebaseApp();
  return getStorage(app);
}

// Convenience exports
export const clientAuth = typeof window !== 'undefined' ? getClientAuth() : null;
export const clientDb = typeof window !== 'undefined' ? getClientDb() : null;
export const clientStorage = typeof window !== 'undefined' ? getClientStorage() : null;
