// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-4887c.firebaseapp.com",
  projectId: "mern-estate-4887c",
  storageBucket: "mern-estate-4887c.appspot.com",
  messagingSenderId: "201114383494",
  appId: "1:201114383494:web:c268734aa41d534bcb8d07"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);