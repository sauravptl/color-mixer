import { initializeApp } from 'firebase/app';

// Firebase configuration
// Get these values from your Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyBkqOo7RUpwOs8u5jJPEd-dccO9zACvmDE",
  authDomain: "color-mixer-f7382.firebaseapp.com",
  projectId: "color-mixer-f7382",
  storageBucket: "color-mixer-f7382.firebasestorage.app",
  messagingSenderId: "503171706708",
  appId: "1:503171706708:web:98caea88ed85b8b7f662c1",
  measurementId: "G-M460YB15TX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);