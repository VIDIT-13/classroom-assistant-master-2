// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC4h7X08nxb-Q_Hcl1_pdcnW_dml7dboxY",
  authDomain: "ai-assistance-6f77c.firebaseapp.com",
  projectId: "ai-assistance-6f77c",
  storageBucket: "ai-assistance-6f77c.firebasestorage.app",
  messagingSenderId: "858363822853",
  appId: "1:858363822853:web:c30fb4149b7701bf9d6d6c",
  measurementId: "G-G9VHD2PP8S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export default app;