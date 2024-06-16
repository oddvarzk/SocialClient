import { register } from "../api/auth/register.mjs";

export function setRegisterFormListener() {
  const form = document.querySelector("#registerForm");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent the form from submitting
      const form = event.target;
      const formData = new FormData(form);
      const profile = Object.fromEntries(formData.entries());

      register(profile);
    });
  }
}
