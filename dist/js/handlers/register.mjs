import { register } from "../api/auth/register.mjs";

export function setRegisterFormListener() {
  const form = document.querySelector("#registerForm");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent the form from submitting
      const form = event.target;
      const formData = new FormData(form);
      const profile = Object.fromEntries(formData.entries());

      // Call register function
      register(profile)
        .then((result) => {
          // On successful registration, redirect to the login page
          alert("User registered successfully!");
          window.location.href = "/login"; // Redirect to login page
        })
        .catch((error) => {
          // Handle registration failure
          alert(`Registration failed: ${error.message}`);
        });
    });
  }
}
