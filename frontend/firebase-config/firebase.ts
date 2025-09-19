// Firebase configuration for My Travel Saathi
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Replace with your API key
  authDomain: "mytravelsaathi-472115.firebaseapp.com",
  projectId: "mytravelsaathi-472115",
  storageBucket: "mytravelsaathi-472115.appspot.com",
  messagingSenderId: "123456789012", // Replace with your sender ID
  appId: "1:123456789012:web:abcdef1234567890abcdef", // Replace with your app ID
  measurementId: "G-XXXXXXXXXX" // Replace with your measurement ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development (optional)
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines if you want to use Firebase emulators
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, "localhost", 8080);
  // connectStorageEmulator(storage, "localhost", 9199);
}

export default app;
