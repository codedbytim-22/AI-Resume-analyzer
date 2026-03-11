// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-ai.js";

const firebaseConfig = {
  apiKey: "AIzaSyBEvXzSaNtHpbL8vahq_Un9bQoIR_vZX3A",
  authDomain: "resume-analyzer-665b7.firebaseapp.com",
  projectId: "resume-analyzer-665b7",
  storageBucket: "resume-analyzer-665b7.appspot.com",
  messagingSenderId: "649168592579",
  appId: "1:649168592579:web:8b14aa09ed53d47fcb4c76",
};

const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

//  Initialize Gemini AI backend
const ai = getAI(app, { backend: new GoogleAIBackend() });

//  Create GenerativeModel instance
export const model = getGenerativeModel(ai, {
  model: "gemini-3-flash-preview",
});
