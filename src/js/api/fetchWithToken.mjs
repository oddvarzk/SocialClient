import { loadToken } from "../storage/index.mjs";
import { API_KEY } from "./constants.mjs";

export function headers() {
  const token = loadToken("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
  };
}

export async function fetchWithToken(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: headers(),
  });
}
