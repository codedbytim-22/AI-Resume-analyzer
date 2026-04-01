// Firebase Password Reset Feature
// Add to app.js or separate script

import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { auth } from "./firebase.js";

export async function initPasswordReset() {
  const resetLinks = document.querySelectorAll(".password-reset-link");
  resetLinks.forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = prompt("Enter email for password reset:");
      if (!email) return;

      try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent! Check your inbox.");
      } catch (error) {
        alert("Error: " + error.message);
      }
    });
  });
}
