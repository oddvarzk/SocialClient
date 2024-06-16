import { API_SOCIAL_URL } from "../constants.mjs";
import { fetchWithToken } from "../fetchWithToken.mjs";

const action = "posts";
const method = "delete";

export async function removePost(id) {
  const removePostURL = `${API_SOCIAL_URL}${action}/${id}`;

  try {
    const response = await fetchWithToken(removePostURL, {
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
    console.error("Error deleting post:", error);
  }
}
