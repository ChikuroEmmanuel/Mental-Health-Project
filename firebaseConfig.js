import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZB1ij3hsuDWtpve21bOoQsnCd2m8VamY",
  authDomain: "youthcare-app.firebaseapp.com",
  projectId: "youthcare-app",
  storageBucket: "youthcare-app.appspot.com",
  messagingSenderId: "336454679951",
  appId: "1:336454679951:android:ef833830b9ac9d1d805ffa",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

