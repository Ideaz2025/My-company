// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyA-IowniC_riteh01ja0dTtqWyqX-kPLWc",
  authDomain: "ideazedge.firebaseapp.com",
  projectId: "ideazedge",
  storageBucket: "ideazedge.firebasestorage.app",
  messagingSenderId: "1035827150611",
  appId: "1:1035827150611:web:176873841b2e60d6d0a4e6",
  measurementId: "G-6WQ167212T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
