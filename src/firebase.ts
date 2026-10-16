import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwEcQQQFz5tmfIlL1sbz3ujSmo3niJfRU",
  authDomain: "plmspiders-f07c7.firebaseapp.com",
  projectId: "plmspiders-f07c7",
  storageBucket: "plmspiders-f07c7.firebasestorage.app",
  messagingSenderId: "807519099942",
  appId: "1:807519099942:web:039eda5beff0d735a99ae7",
  measurementId: "G-8P66PJZFGZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Sign-In provider for authenticating with a Google account
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

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
