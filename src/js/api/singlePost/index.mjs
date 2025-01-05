import { API_SOCIAL_URL, API_KEY } from "../../api/constants.mjs"; 
import { loadToken } from "../../storage/index.mjs";

/**
 * Function to get query parameters
 * @param {string} param - The name of the query parameter to retrieve
 * @returns {string|null} - The value of the query parameter or null if not found
 */
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", () => {
  const postId = getQueryParam('id');

  if (!postId) {
    alert("No post ID provided.");
    window.location.href = "/feed/";
    return;
  }

  const token = loadToken("token");
  if (!token) {
    alert("You must be logged in to view this post.");
    window.location.href = "/login/";
    return;
  }

  const singlePostURL = `${API_SOCIAL_URL}posts/${postId}?_author=true&_comments=true`;

  fetch(singlePostURL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not fetch post");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Single post data:", data);

      const postTitleElem = document.querySelector(".card-title");
      const postAuthorElem = document.querySelector(".card-username");
      const postBodyElem = document.querySelector(".card-text");
      const postImageElem = document.querySelector(".card-image");
      
      const postData = data.data;
      
      if (postTitleElem) {
        postTitleElem.textContent = postData.title || "Untitled Post";
      }
      if (postAuthorElem) {
        postAuthorElem.textContent = postData.author?.name || "Unknown User";
      }
      if (postBodyElem) {
        postBodyElem.textContent = postData.body || "";
      }
      if (postImageElem) {
        postImageElem.src = postData.media?.url || "/images/default-image.jpg";
        postImageElem.alt = postData.media?.alt || "Post image";
      }

    })
    .catch((error) => {
      console.error("Error loading single post:", error);
      alert("Failed to load post.");
    });
});
