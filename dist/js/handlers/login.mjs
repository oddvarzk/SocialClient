import { login } from "../api/auth/login.mjs";

export function setLoginFormListener() {
  const form = document.querySelector("#loginForm");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent the form from submitting
      const form = event.target;
      const formData = new FormData(form);
      const profile = Object.fromEntries(formData.entries());

      // Call login function
      login(profile)
        .then(() => {
          // Redirect on successful login
          window.location.href = "/feed"; // Redirect to the feed page
        })
        .catch((error) => {
          // Handle login failure
          alert(`Login failed: ${error.message}`);
        });
    });
  }
}
