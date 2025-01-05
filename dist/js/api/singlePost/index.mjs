// singlePost.mjs

// 1. Import any helpers or constants you need
import { API_SOCIAL_URL, API_KEY } from "../../api/constants.mjs"; 
// If you have a loadToken or something similar, import that:
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
  // 2a. Parse the post ID from the query parameter
  const postId = getQueryParam('id');

  if (!postId) {
    alert("No post ID provided.");
    window.location.href = "/feed/";
    return;
  }

  // 2b. Load the token
  const token = loadToken("token");
  if (!token) {
    alert("You must be logged in to view this post.");
    window.location.href = "/login/";
    return;
  }

  // 3. Build the fetch URL, including author/comments if desired
  const singlePostURL = `${API_SOCIAL_URL}posts/${postId}?_author=true&_comments=true`;

  // 4. Fetch the single post
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
      // 5. data.data should contain the single post
      console.log("Single post data:", data);

      // 6. Update the DOM
      // Select elements
      const postTitleElem = document.querySelector(".card-title");
      const postAuthorElem = document.querySelector(".card-username");
      const postBodyElem = document.querySelector(".card-text");
      const postImageElem = document.querySelector(".card-image");
      
      // The API response shape is typically { data: { ...postFields } }
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
        // If there's a media url
        postImageElem.src = postData.media?.url || "/images/default-image.jpg";
        postImageElem.alt = postData.media?.alt || "Post image";
      }

      // Optionally, handle comments, reactions, etc.
      // For example, displaying comment count:
      /*
      const commentCountElem = document.createElement('p');
      commentCountElem.textContent = `Comments: ${postData._count.comments}`;
      document.querySelector('.card-body').appendChild(commentCountElem);
      */
    })
    .catch((error) => {
      console.error("Error loading single post:", error);
      alert("Failed to load post.");
    });
});
