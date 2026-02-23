import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// -------------------- SIGNUP --------------------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Save user info in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName,
        email,
        createdAt: new Date(),
      });

      // Redirect to dashboard
      window.location.href = "dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

// -------------------- LOGIN --------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

const welcomeEl = document.getElementById("welcome-message");
const emailEl = document.getElementById("user-email");
const logoutLink = document.getElementById("logout-link");

if (welcomeEl && emailEl) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const userData = docSnap.exists() ? docSnap.data() : {};
      const fullName = userData.fullName || "";
      const email = userData.email || user.email;

      welcomeEl.textContent = `Welcome${fullName ? " " + fullName : ""}!`;
      emailEl.textContent = email;
    } catch (err) {
      console.error("Error fetching user data:", err);
      welcomeEl.textContent = "Welcome!";
      emailEl.textContent = user.email;
    }
  });
}

// -------------------- LOGOUT --------------------
if (logoutLink) {
  logoutLink.addEventListener("click", async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = "login.html";
  });
}
