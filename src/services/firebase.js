import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBoxzFW-agn-TXk45Iz-4vEduUGAs1aifw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "phish-guard-1c234.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "phish-guard-1c234",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "phish-guard-1c234.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "966493169500",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:966493169500:web:99019091816636c7244399",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GFKH2RVS17"
};

// Initialize Firebase App instance
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Cloud Firestore Database
export const db = getFirestore(app);

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit
};
