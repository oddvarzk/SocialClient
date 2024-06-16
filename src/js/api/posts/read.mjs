import { API_SOCIAL_URL } from "../constants.mjs";
import { fetchWithToken } from "../fetchWithToken.mjs";

const action = "posts";
const method = "GET";

export async function getPosts() {
  const getPostsURL = `${API_SOCIAL_URL}${action}`;

  try {
    const response = await fetchWithToken(getPostsURL, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

export async function getPost(id) {
  const getPostURL = `${API_SOCIAL_URL}${action}/${id}`;

  try {
    const response = await fetchWithToken(getPostURL, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!id) {
      throw new Error(`Error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}
