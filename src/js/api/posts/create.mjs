import { API_SOCIAL_BASE } from "../constants.mjs";
import { fetchWithToken } from "../fetchWithToken.mjs";

const action = "posts";
const method = "POST";

export async function createPost(postData) {
  const createPostURL = API_SOCIAL_BASE + action;

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

    const post = await response.json();
    console.log(post);
  } catch (error) {
    console.error("Error creating post:", error);
  }
}
