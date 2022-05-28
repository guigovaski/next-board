// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFvTcew3KAc4jB2zK5ScpUIKAy1RlM9Js",
  authDomain: "boardapp-c6cf9.firebaseapp.com",
  projectId: "boardapp-c6cf9",
  storageBucket: "boardapp-c6cf9.appspot.com",
  messagingSenderId: "425257244928",
  appId: "1:425257244928:web:af9a190b943c8665bc7be5"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);