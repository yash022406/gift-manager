import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// import { getMessaging, getToken } from "firebase/messaging";
import {
  collection,
  getFirestore,
  getDocs
} from 'firebase/firestore';
import {
  getDatabase, ref, child, get, set
} from 'firebase/database'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTXAmuw9FFiA2AvM2WaR0KEOxer1vtbI4",
  authDomain: "giftmanagement-9f7f3.firebaseapp.com",
  projectId: "giftmanagement-9f7f3",
  storageBucket: "giftmanagement-9f7f3.appspot.com",
  messagingSenderId: "589341450098",
  appId: "1:589341450098:web:ee87df7c4c777bce8a47eb",
  measurementId: "G-0FESWL9NN3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);
export const realdb = getDatabase(app)

// Get a reference to the collection
// const colRef = collection(db, "users");

// Fetch documents from the collection
// getDocs(colRef)
//   .then((snapshot) => {
//     let users = [];
//     snapshot.docs.forEach(doc => {
//       users.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(users);
//   })
//   .catch(error => {
//     console.error("Error fetching documents: ", error);
//   });

export default app;
