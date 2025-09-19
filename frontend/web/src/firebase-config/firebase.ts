// Firebase configuration for My Travel Saathi - TESTING VERSION
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - TESTING/DEMO VERSION
// In production, replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: "demo-api-key-for-testing",
  authDomain: "mytravelsaathi-demo.firebaseapp.com",
  projectId: "mytravelsaathi-demo",
  storageBucket: "mytravelsaathi-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// For testing, we'll use mock authentication
// In production, uncomment the emulator connections below
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines if you want to use Firebase emulators
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, "localhost", 8080);
  // connectStorageEmulator(storage, "localhost", 9199);
}

export default app;
