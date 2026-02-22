// Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

// Services
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBEvXzSaNtHpbL8vahq_Un9bQoIR_vZX3A",
  authDomain: "resume-analyzer-665b7.firebaseapp.com",
  projectId: "resume-analyzer-665b7",
  storageBucket: "resume-analyzer-665b7.appspot.com", // fix typo .app → .appspot
  messagingSenderId: "649168592579",
  appId: "1:649168592579:web:8b14aa09ed53d47fcb4c76",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
