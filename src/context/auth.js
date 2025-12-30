import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_NAME}.firebaseapp.com`,
  projectId: `${process.env.REACT_APP_FIREBASE_NAME}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_NAME}.firebasestorage.app`,
  messagingSenderId: "976728971032",
  appId: "1:976728971032:web:ab215987d3918ece54306d",
  measurementId: "G-CJ59NNSPGB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 

//manage firebase