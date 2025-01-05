import { API_SOCIAL_URL } from "../constants.mjs";
import { fetchWithToken } from "../fetchWithToken.mjs";

const action = "posts";

export async function removePost(id) {
  if (!id) {
    console.error("Post ID is required to delete a post.");
    return null;
  }

  const baseURL = API_SOCIAL_URL.endsWith('/') ? API_SOCIAL_URL : `${API_SOCIAL_URL}/`;
  const removePostURL = `${baseURL}${action}/${id}`;

  try {
    const response = await fetchWithToken(removePostURL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
    }

    console.log(`Post with ID ${id} deleted successfully.`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: error.message };
  }
}
