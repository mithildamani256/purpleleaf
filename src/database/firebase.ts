import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBYtOs9cm5osRMg5qHVrqdQzaNjrvnLW28",
  authDomain: "webscrape-3ccc7.firebaseapp.com",
  projectId: "webscrape-3ccc7",
  storageBucket: "webscrape-3ccc7.appspot.com",
  messagingSenderId: "870133419659",
  appId: "1:870133419659:web:771b36edba8f1278264e8e",
  measurementId: "G-CJHJX62B2V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);