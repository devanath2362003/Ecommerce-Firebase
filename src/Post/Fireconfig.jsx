// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAeiym6bk0fE-b9KkZAs7xXd47UPeFyHhs",
  authDomain: "ecommerce-81fe4.firebaseapp.com",
  projectId: "ecommerce-81fe4",
  storageBucket: "ecommerce-81fe4.appspot.com",
  messagingSenderId: "917614818346",
  appId: "1:917614818346:web:3ce489874122a922da7f53",
  measurementId: "G-DJVKG62TFM",
  databaseURL: "https://ecommerce-81fe4-default-rtdb.firebaseio.com/"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Export Auth, Google Provider, and Realtime Database
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);

// Optional: export default app (if needed elsewhere)
export default app;
