import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// REPLACE THESE with your actual configuration from the Firebase Console!
const firebaseConfig = {
  apiKey: "AIzaSyBCkxel7pu9EO9vgAgVGVEOT52uiYXcekQ",
  authDomain: "expense-tracker-95059.firebaseapp.com",
  projectId: "expense-tracker-95059",
  storageBucket: "expense-tracker-95059.firebasestorage.app",
  messagingSenderId: "525034523763",
  appId: "1:525034523763:web:3063c9b1bf9417d27cae06",
  measurementId: "G-1J64826EDR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
