import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAIEjrLWN0HqX_BiBxTHKFYgGLYJ8z98m8",
  authDomain: "findyournexthome-amsterdam.firebaseapp.com",
  projectId: "findyournexthome-amsterdam",
  storageBucket: "findyournexthome-amsterdam.firebasestorage.app",
  messagingSenderId: "183756109142",
  appId: "1:183756109142:web:6cfd9cca63281813b692f7",
  measurementId: "G-GSYWHH8EE7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
