import { API_BASE } from "../constants.mjs";

const action = "auth/register"; // The API endpoint path
const method = "POST"; // The HTTP method

/**
 * Register function that sends registration data to the server.
 * @param {Object} profile - User's profile data.
 * @returns {Promise} Resolves on successful registration.
 */
export async function register(profile) {
  const registerURL = API_BASE + action;

  try {
    const response = await fetch(registerURL, {
      headers: {
        "Content-Type": "application/json",
      },
      method,
      body: JSON.stringify(profile),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);  // Reject if registration fails
    }

    return Promise.resolve(result);  // Resolve with result
  } catch (error) {
    return Promise.reject(error);  // Reject on error
  }
}
