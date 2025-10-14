// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBBz7b0jPAGkF9SCpvonz3kOEfr5l1pN9o",
  authDomain: "sem2-deb79.firebaseapp.com",
  projectId: "sem2-deb79",
  storageBucket: "sem2-deb79.firebasestorage.app",
  messagingSenderId: "703940177721",
  appId: "1:703940177721:web:43e3e6de2ff291a93e02e8",
  measurementId: "G-CYPYC0ZXNJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export services
export { app, auth, db, storage, analytics };
