import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyCh-fYz6w3SrZA4XC85rbrFOv4b5TQCLXo",
//   authDomain: "acn-resale-inventories-dde03.firebaseapp.com",
//   databaseURL: "https://acn-resale-inventories-dde03-default-rtdb.firebaseio.com",
//   projectId: "acn-resale-inventories-dde03",
//   storageBucket: "acn-resale-inventories-dde03.firebasestorage.app",
//   messagingSenderId: "727649873733",
//   appId: "1:727649873733:web:31c6731000428aebf3982c",
//   measurementId: "G-PF5GCHFMTW",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
export const db = getFirestore(app);