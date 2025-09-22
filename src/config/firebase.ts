import { initializeApp } from 'firebase/app';

// Firebase configuration
// You'll need to replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "color-mixer-app.firebaseapp.com",
  projectId: "color-mixer-app",
  storageBucket: "color-mixer-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);