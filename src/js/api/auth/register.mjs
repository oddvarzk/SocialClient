import { API_BASE } from "../constants.mjs";

const action = "auth/register"; // The API endpoint path
const method = "POST"; // The HTTP method

export async function register(profile) {
  const registerURL = API_BASE + action;

  const response = await fetch(registerURL, {
    headers: {
      "Content-Type": "application/json",
    },
    method,
    body: JSON.stringify(profile),
  });

  const result = await response.json();
  alert("User registered successfully!");
  return result;
}
