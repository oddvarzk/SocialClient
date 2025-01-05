import { API_BASE } from "../constants.mjs";
import { saveToken, saveObject } from "../../storage/index.mjs";

const action = "auth/login";
const method = "POST";

/**
 * Login function that sends a login request to the server and handles the response.
 * @param {Object} profile - User's profile with email and password.
 * @returns {Promise} Resolves on successful login.
 */
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
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const result = await response.json();

    // Store token (as raw string) and profile (as JSON object) in localStorage
    saveToken("token", result.data.accessToken);
    saveObject("profile", result.data);

    // Resolve when login is successful
    return Promise.resolve();
  } catch (error) {
    // Reject on error
    return Promise.reject(error);
  }
}
