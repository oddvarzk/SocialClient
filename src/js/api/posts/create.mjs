import { API_SOCIAL_URL } from "../constants.mjs";
import { fetchWithToken } from "../fetchWithToken.mjs";

const action = "posts";
const method = "POST";

export async function createPost(postData) {
  const createPostURL = API_SOCIAL_URL + action;

  try {
    const response = await fetchWithToken(createPostURL, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
  }
}
