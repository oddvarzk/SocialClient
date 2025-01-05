import { updatePost } from "../update.mjs";
import { API_SOCIAL_URL } from "../../constants.mjs";
import { fetchWithToken } from "../../fetchWithToken.mjs";

export function showUpdatePostModal(postId) {
  
  fetchPostDetails(postId)
    .then(postData => {
      if (postData) {
        populateModal(postData);
        displayModal();
      } else {
        alert("Failed to retrieve post details. Please try again.");
      }
    })
    .catch(error => {
      console.error("Error fetching post details:", error);
      alert("An error occurred while fetching post details.");
    });
}

/**
 * Fetches the details of a specific post.
 * @param {number|string} postId - The ID of the post to fetch.
 * @returns {Promise<object|null>} - The post data or null if failed.
 */
async function fetchPostDetails(postId) {
  const baseURL = API_SOCIAL_URL.endsWith('/') ? API_SOCIAL_URL : `${API_SOCIAL_URL}/`;
  const url = `${baseURL}posts/${encodeURIComponent(postId)}?_author=true&_comments=true&_reactions=true`;

  try {
    const response = await fetchWithToken(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch post details. Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching post details:", error);
    return null;
  }
}

/**
 * Populates the Update Post modal with existing post data.
 * @param {object} post - The post data.
 */
function populateModal(post) {
  const updatePostId = document.getElementById("updatePostId");
  const updatePostTitle = document.getElementById("updatePostTitle");
  const updatePostDescription = document.getElementById("updatePostDescription");
  const updatePostImage = document.getElementById("updatePostImage");
  const updatePostLabel = document.getElementById("updatePostLabel");

  if (updatePostId && updatePostTitle && updatePostDescription && updatePostImage && updatePostLabel) {
    updatePostId.value = post.id;
    updatePostTitle.value = post.title;
    updatePostDescription.value = post.body;
    updatePostImage.value = post.media?.url || "";
    updatePostLabel.value = post.tags && post.tags.length > 0 ? post.tags.join(', ') : "";
  } else {
    console.error("One or more modal elements not found.");
  }
}

/**
 * Displays the Update Post modal.
 */
function displayModal() {
  const updatePostModalElement = document.getElementById('updatePostModal');
  if (updatePostModalElement) {
    const updatePostModal = new bootstrap.Modal(updatePostModalElement, {
      keyboard: false
    });
    updatePostModal.show();

    // Event listener for form submission
    const updatePostForm = document.getElementById("updatePostForm");
    if (updatePostForm) {
      updatePostForm.addEventListener("submit", handleUpdatePostSubmit);
    } else {
      console.error("Update Post form not found.");
    }
  } else {
    console.error("Update Post modal element not found.");
  }
}

/**
 * Handles the submission of the Update Post form.
 * @param {Event} event - The form submission event.
 */
async function handleUpdatePostSubmit(event) {
  event.preventDefault();

  const updatePostId = document.getElementById("updatePostId").value;
  const updatePostTitle = document.getElementById("updatePostTitle").value.trim();
  const updatePostDescription = document.getElementById("updatePostDescription").value.trim();
  const updatePostImage = document.getElementById("updatePostImage").value.trim();
  const updatePostLabel = document.getElementById("updatePostLabel").value.trim();

  // Validate form data
  if (!updatePostTitle || !updatePostDescription) {
    alert("Please provide both a title and a description for your post.");
    return;
  }

  if (updatePostImage && !isValidURL(updatePostImage)) {
    alert("Please enter a valid URL for the image.");
    return;
  }

  const updatedPostData = {
    id: updatePostId, 
    title: updatePostTitle,
    body: updatePostDescription,
    media: updatePostImage ? { url: updatePostImage } : null,
    tags: updatePostLabel ? updatePostLabel.split(',').map(tag => tag.trim()) : [],
  };


  try {
    const response = await updatePost(updatedPostData);
    if (response) {
      alert("Post updated successfully!");
      // Close the modal
      const updatePostModalElement = document.getElementById('updatePostModal');
      const updatePostModal = bootstrap.Modal.getInstance(updatePostModalElement);
      updatePostModal.hide();
      // Refresh the profile posts
      location.reload();
    } else {
      alert("Failed to update post. Please try again.");
    }
  } catch (error) {
    console.error("Error during post update:", error);
    alert("An error occurred while updating the post. Please try again.");
  }
}

/**
 * Validates if a string is a valid URL.
 * @param {string} string - The string to validate.
 * @returns {boolean} - True if valid URL, else false.
 */
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
