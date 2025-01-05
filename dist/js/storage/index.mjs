/**
 * ============================
 * 1) TOKEN AS A RAW STRING
 * ============================
 */

/**
 * Save a token (raw string) to localStorage.
 * @param {string} key - The localStorage key name.
 * @param {string} token - The JWT or other string token to store.
 */
export function saveToken(key, token) {
  localStorage.setItem(key, token);
}

/**
 * Load a token (raw string) from localStorage.
 * @param {string} key - The localStorage key name.
 * @returns {string|null} The stored token, or null if not found.
 */
export function loadToken(key) {
  return localStorage.getItem(key);
}

/**
 * Remove an item from localStorage.
 * @param {string} key - The localStorage key name.
 */
export function removeItem(key) {
  localStorage.removeItem(key);
}


/**
 * ============================
 * 2) OBJECTS STORED AS JSON
 * ============================
 */

/**
 * Save an object to localStorage (JSON-serialized).
 * @param {string} key - The localStorage key name.
 * @param {object} obj - The object to store.
 */
export function saveObject(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}

/**
 * Load an object from localStorage (JSON-deserialized).
 * @param {string} key - The localStorage key name.
 * @returns {object|null} The parsed object, or null if not found or parsing fails.
 */
export function loadObject(key) {
  try {
    const value = localStorage.getItem(key);
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}
