// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";         
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsnPsq8B3UwvzvHPclhpURuzrRFEUJR28",
  authDomain: "book-change-service.firebaseapp.com",
  projectId: "book-change-service",
  storageBucket: "book-change-service.firebasestorage.app",
  messagingSenderId: "156811400232",
  appId: "1:156811400232:web:9359bbacae7d52633b911d",
  measurementId: "G-E0JLGV7P2T"
};

// const analytics = getAnalytics(app);


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);