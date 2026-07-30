import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQwofiGe1AYU0e0t06BRj_nhEerDUMNSo",
  authDomain: "brand-quiz-8cbe6.firebaseapp.com",
  projectId: "brand-quiz-8cbe6",
  storageBucket: "brand-quiz-8cbe6.firebasestorage.app",
  messagingSenderId: "520745425907",
  appId: "1:520745425907:web:ca0ef6903f84c3bb0b5086",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);