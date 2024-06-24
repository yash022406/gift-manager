import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
export default app 