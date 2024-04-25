// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA65iey6xkdcH9Up8fcYFhRiHmbLYQ88-s",
  authDomain: "may-vacation-tracker.firebaseapp.com",
  projectId: "may-vacation-tracker",
  storageBucket: "may-vacation-tracker.appspot.com",
  messagingSenderId: "631224941782",
  appId: "1:631224941782:web:1fcc2d4dce78e568115d77",
  measurementId: "G-NB76WJTRHY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);