import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBz0s_7ECdrWzaxvzZHr_yLOu9DGvxy4TI",
  authDomain: "todo-app-28b03.firebaseapp.com",
  projectId: "todo-app-28b03",
  storageBucket: "todo-app-28b03.firebasestorage.app",
  messagingSenderId: "1058143239407",
  appId: "1:1058143239407:web:93cbd3d713a9ff79d46f1a",
  measurementId: "G-6T8Q68HTXG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export let analytics: Analytics | undefined;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(() => {
      analytics = undefined;
    });
}
