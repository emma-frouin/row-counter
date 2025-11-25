import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC1AjxA7eJAipANA-9591TRN_FhB3dEQuE",
  authDomain: "froufrougs-row-counter.firebaseapp.com",
  projectId: "froufrougs-row-counter",
  storageBucket: "froufrougs-row-counter.firebasestorage.app",
  messagingSenderId: "1021093405142",
  appId: "1:1021093405142:web:4f46d042ae8e6b99edc477"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

