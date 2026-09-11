import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0u06moew3PdKB651ryc3hdjLzGMoHOsQ",
  authDomain: "wishlist-1b9b9.firebaseapp.com",
  projectId: "wishlist-1b9b9",
  storageBucket: "wishlist-1b9b9.firebasestorage.app",
  messagingSenderId: "543040063898",
  appId: "1:543040063898:web:6e333f36a602b2b82b1223",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
