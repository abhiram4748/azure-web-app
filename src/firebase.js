import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBbVrg2KoL-Ub3r4Mir38VVgm-HEhSoVwE",
    authDomain: "portfol-b134f.firebaseapp.com",
    projectId: "portfol-b134f",
    storageBucket: "portfol-b134f.firebasestorage.app",
    messagingSenderId: "272255421444",
    appId: "1:272255421444:web:f26002467b4f6570fb3951",
    measurementId: "G-SV3WG4HXVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
