import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "irl-app-4be2c.firebaseapp.com",
  projectId: "irl-app-4be2c",
  storageBucket: "irl-app-4be2c.firebasestorage.app",
  messagingSenderId: "1067010413204",
  appId: "1:1067010413204:web:9a8c9a1bb3d47991aa1a81",
  measurementId: "G-6ZVFJMNJJD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 

//manage firebase