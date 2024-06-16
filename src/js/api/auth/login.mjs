import { API_BASE } from "../constants.mjs";
import * as storage from "../../storage/index.mjs";

const action = "auth/login"; // The API endpoint path
const method = "POST"; // The HTTP method

export async function login(profile) {
  const loginURL = API_BASE + action;

  try {
    const response = await fetch(loginURL, {
      headers: {
        "Content-Type": "application/json",
      },
      method,
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(`Login failed: ${error.message}`);
      return;
    }

    const result = await response.json();

    storage.save("token", result.data.accessToken);
    storage.save("profile", result.data);

    alert("User logged in successfully!");

    // Redirect to the profile page
    window.location.href = "/profile";
  } catch (error) {
    alert(`An error occurred: ${error.message}`);
  }
}
