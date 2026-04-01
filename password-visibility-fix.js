// Add password visibility toggle to signup/login forms
// Include this script in signup.html and login.html after app.js

function togglePassword(fieldId, button) {
  const field = document.getElementById(fieldId);
  if (field.type === "password") {
    field.type = "text";
    button.textContent = "🙈";
    button.title = "Hide password";
  } else {
    field.type = "password";
    button.textContent = "👁";
    button.title = "Show password";
  }
}

// Auto-init toggles on page load
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const fieldId = e.currentTarget.dataset.for;
      togglePassword(fieldId, e.currentTarget);
    });
  });
});
