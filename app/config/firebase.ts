import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCh-fYz6w3SrZA4XC85rbrFOv4b5TQCLXo",
  authDomain: "acn-resale-inventories-dde03.firebaseapp.com",
  databaseURL: "https://acn-resale-inventories-dde03-default-rtdb.firebaseio.com",
  projectId: "acn-resale-inventories-dde03",
  storageBucket: "acn-resale-inventories-dde03.firebasestorage.app",
  messagingSenderId: "727649873733",
  appId: "1:727649873733:web:31c6731000428aebf3982c",
  measurementId: "G-PF5GCHFMTW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, firebaseConfig ,auth}; 