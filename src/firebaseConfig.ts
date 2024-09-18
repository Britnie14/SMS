import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYwt8I-fVFJTTGJ0UkoWZbqFfMcscY7_Y",
  authDomain: "sms-response-f57a9.firebaseapp.com",
  databaseURL: "https://sms-response-f57a9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sms-response-f57a9",
  storageBucket: "sms-response-f57a9.appspot.com",
  messagingSenderId: "748303894788",
  appId: "1:748303894788:web:e0b4ed675cf4aaed2da851"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

const storage  = getStorage(app);



export { db, auth, storage };
