import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDummyKey-ForDemoPurposeOnly",
  authDomain: "majdoorhub-demo.firebaseapp.com",
  projectId: "majdoorhub-demo",
  storageBucket: "majdoorhub-demo.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);