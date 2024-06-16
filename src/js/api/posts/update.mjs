import { API_SOCIAL_URL } from "../constants.mjs";
import { fetchWithToken } from "../fetchWithToken.mjs";

const action = "posts";
const method = "PUT";

export async function updatePost(postData) {
  const updatePostURL = `${API_SOCIAL_URL}${action}/${postData.id}`;

  try {
    const response = await fetchWithToken(updatePostURL, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
  }
}
