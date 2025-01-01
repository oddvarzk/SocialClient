// /src/js/storage/profile/profile.mjs

import { loadObject, loadToken } from "../storage/index.mjs"; // Adjust the path as needed
import { API_SOCIAL_URL } from "../api/constants.mjs";
import { fetchWithToken } from "../api/fetchWithToken.mjs";

export function initializeProfile() {

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleProfile);
  } else {
    // DOM is already loaded
    handleProfile();
  }

  async function handleProfile() {

    // 1. Load the user profile from localStorage
    const user = loadObject("profile");
    const token = loadToken("token");

    // 2. Check if user or token is missing
    if (!user || !token) {
      if (!window.hasProfileAlerted) {
        alert("No user profile or token found. Please log in first.");
        window.hasProfileAlerted = true; // Set a flag
        window.location.href = "/login/";
      }
      return;
    }
    // 3. Update basic profile fields in the DOM

    // Avatar
    const avatarImg = document.querySelector("img[alt='Profile Image']");
    if (avatarImg) {
      avatarImg.src = user.avatar?.url ?? "/images/profile-user.svg";
    } else {
      console.warn("Profile Image element not found.");
    }

    // Username
    const usernameElem = document.querySelector(".profile-name");
    if (usernameElem) {
      usernameElem.textContent = user.name ?? "UnknownUser";
    } else {
      console.warn("Profile Name element not found.");
    }

    // Email
    const emailElem = document.querySelector(".profile-email");
    if (emailElem) {
      emailElem.textContent = user.email ?? "No Email Provided";
    } else {
      console.warn("Profile Email element not found.");
    }

    // 4. Fetch the user's posts from the API with additional details
    try {
      // Ensure correct URL formation with trailing slash
      const baseURL = API_SOCIAL_URL.endsWith('/') ? API_SOCIAL_URL : `${API_SOCIAL_URL}/`;
      const url = `${baseURL}profiles/${encodeURIComponent(user.name)}?_posts=true&_author=true&_comments=true&_reactions=true`;
      const response = await fetchWithToken(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile/posts. Status: ${response.status}`);
      }

      const profileData = await response.json();

      // Access posts correctly based on API response structure
      const userPosts = profileData.data.posts || []; // Correct path

      // 5. Render the posts into the #profile-posts-container
      const postsContainer = document.getElementById("profile-posts-container");
      if (postsContainer) {
        // Clear any previous content
        postsContainer.innerHTML = "";

        // If no posts, show a friendly message
        if (userPosts.length === 0) {
          postsContainer.innerHTML = "<p>You have no posts yet.</p>";
        } else {
          userPosts.forEach((post) => {
            // Create a card-like structure for each post
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("card", "mb-4", "w-100"); // Added margin for spacing and full width

            cardDiv.innerHTML = `
              <div class="card-header">
                <h5 class="card-title">${sanitizeHTML(post.title) || "Untitled Post"}</h5>
                <small class="text-muted">Created on: ${new Date(post.created).toLocaleDateString()}</small>
              </div>
              <div class="card-body">
                ${post.media?.url ? `<img src="${sanitizeURL(post.media.url)}" class="img-fluid mb-3" alt="${sanitizeHTML(post.media.alt) || 'Post Image'}">` : ""}
                <p class="card-text">${sanitizeHTML(post.body) || ""}</p>
                ${post.tags && post.tags.length > 0 ? `<p><strong>Tags:</strong> ${post.tags.map(tag => sanitizeHTML(tag)).join(', ')}</p>` : ""}
              </div>
              <div class="card-footer text-end">
                <button class="btn btn-primary btn-sm update-post-button" data-post-id="${post.id}">Update</button>
                <button class="btn btn-danger btn-sm delete-post-button" data-post-id="${post.id}">Delete</button>
              </div>
            `;
            postsContainer.appendChild(cardDiv);
          });
        }
      } else {
        console.warn("#profile-posts-container not found.");
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      // Optionally, display an error message to the user
      const postsContainer = document.getElementById("profile-posts-container");
      if (postsContainer) {
        postsContainer.innerHTML = "<p>Failed to load posts. Please try again later.</p>";
      }
    }

    // 6. Add event listeners to the Update and Delete buttons
    addPostButtonListeners();
  }

  /**
   * Adds event listeners to all Update and Delete buttons.
   */
  function addPostButtonListeners() {
    const updateButtons = document.querySelectorAll(".update-post-button");
    updateButtons.forEach((button) => {
      button.addEventListener("click", handleUpdateButtonClick);
    });

    const deleteButtons = document.querySelectorAll(".delete-post-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", handleDeleteButtonClick);
    });
  }

  /**
   * Handles the click event for Update buttons.
   * @param {Event} event - The click event.
   */
  function handleUpdateButtonClick(event) {
    const button = event.currentTarget;
    const postId = button.getAttribute("data-post-id");
    // Import and invoke the function to show the update modal
    import("../api/posts/updatePost/index.mjs") // Adjust the path if necessary
      .then(({ showUpdatePostModal }) => {
        showUpdatePostModal(postId);
      })
      .catch(error => {
        console.error("Error loading updatePost.mjs:", error);
      });
  }

  /**
   * Handles the click event for Delete buttons.
   * @param {Event} event - The click event.
   */
  function handleDeleteButtonClick(event) {
    const button = event.currentTarget;
    const postId = button.getAttribute("data-post-id");
    // Implement delete functionality here or import a delete module
    // For now, we'll just log it
    alert(`Delete functionality for post ID: ${postId} is not implemented yet.`);
  }

  /**
   * Utility function to sanitize HTML content to prevent XSS attacks.
   * @param {string} str - The string to sanitize.
   * @returns {string} - The sanitized string.
   */
  function sanitizeHTML(str) {
    const tempDiv = document.createElement("div");
    tempDiv.textContent = str;
    return tempDiv.innerHTML;
  }

  /**
   * Utility function to sanitize URLs.
   * @param {string} url - The URL to sanitize.
   * @returns {string} - The sanitized URL.
   */
  function sanitizeURL(url) {
    try {
      return new URL(url, window.location.origin).href;
    } catch {
      return "";
    }
  }
}
