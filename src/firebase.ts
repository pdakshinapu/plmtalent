import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgFiTwQy31IeELU15Fc5nflaJXkDy70VQ",
  authDomain: "plmtalenthunt.firebaseapp.com",
  projectId: "plmtalenthunt",
  storageBucket: "plmtalenthunt.firebasestorage.app",
  messagingSenderId: "508729190436",
  appId: "1:508729190436:web:e83f3f61079b19f0d2d0b1",
  measurementId: "G-EX9105H2JM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn("Firebase Analytics could not be initialized:", err);
  });
}
