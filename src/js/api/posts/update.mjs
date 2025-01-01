// /src/js/api/posts/update.mjs

import { API_SOCIAL_URL } from "../constants.mjs";
import { fetchWithToken } from "../fetchWithToken.mjs";

const action = "posts";

export async function updatePost(postData) {
  // Ensure there's a slash between API_SOCIAL_URL and action
  const baseURL = API_SOCIAL_URL.endsWith('/') ? API_SOCIAL_URL : `${API_SOCIAL_URL}/`;
  const updatePostURL = `${baseURL}${action}/${postData.id}`;

  try {
    const response = await fetchWithToken(updatePostURL, {
      method: "PUT", // Use "PATCH" if partial updates are supported/preferred
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
}
