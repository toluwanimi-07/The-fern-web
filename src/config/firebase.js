import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDRHLUp9zxY-ZKh5z3_woC6kyw_ttA507E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fern-000001.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fern-000001",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fern-000001.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "286699467124",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:286699467124:web:ead71bb5e824659152bc21",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HYPQ64WK1C",
};

console.log("Firebase Config:", firebaseConfig);

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
