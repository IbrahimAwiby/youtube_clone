import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh4qNvtyoq3FyGgm2YvV8P_W5mNeyM6Vo",
  authDomain: "clone-45f9d.firebaseapp.com",
  projectId: "clone-45f9d",
  storageBucket: "clone-45f9d.firebasestorage.app",
  messagingSenderId: "192871701338",
  appId: "1:192871701338:web:1ae3a7807caece0ca77163",
  measurementId: "G-8X0WED9TLF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
