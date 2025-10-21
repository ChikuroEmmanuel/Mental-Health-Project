import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBsUufYW5ySfS6GUjrxWa5B9kqXPyifUg",
  authDomain: "youthcare-app.firebaseapp.com",
  projectId: "youthcare-app",
  storageBucket: "youthcare-app.firebasestorage.app",
  messagingSenderId: "336454679951",
  appId: "1:336454679951:web:6b9fc558f9f97cd0805ffa"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// Add this line for debugging
console.log("Firebase Config Loaded:", firebaseConfig.appId);