// index.mjs (inside /src/js/storage/profile/)

// 1. Imports
import { loadObject, loadToken } from "../storage/index.mjs"; // or wherever your storage/index.mjs actually is
import { API_SOCIAL_URL } from "../api/constants.mjs"; // Adjust path to your constants.mjs
import { fetchWithToken } from "../api/fetchWithToken.mjs"; // If you have a helper that automatically sets headers

document.addEventListener("DOMContentLoaded", async () => {
  // 2. Load the user profile from localStorage
  const user = loadObject("profile");
  const token = loadToken("token");

  // 2a. Check if user or token is missing
  if (!user || !token) {
    alert("No user profile or token found. Please log in first.");
    window.location.href = "/login/";
    return;
  }

  // 3. Update basic profile fields in the DOM

  // Avatar
  const avatarImg = document.querySelector("img[alt='Profile Image']");
  if (avatarImg) {
    avatarImg.src = user.avatar?.url ?? "/images/profile-user.svg";
  }

  // Username
  const usernameElem = document.querySelector(".profile-name");
  if (usernameElem) {
    usernameElem.textContent = user.name ?? "UnknownUser";
  }

  // Email
  const emailElem = document.querySelector(".profile-email");
  if (emailElem) {
    emailElem.textContent = user.email ?? "No Email Provided";
  }

  // 4. Fetch the user’s posts from the API
  try {
    // The Noroff Social API often has an endpoint like:
    // GET /social/profiles/{username}?_posts=true
    // That returns { name, email, avatar, posts: [...] }

    const url = `${API_SOCIAL_URL}profiles/${user.name}?_posts=true`;
    const response = await fetchWithToken(url);

    if (!response.ok) {
      throw new Error("Failed to fetch user profile/posts.");
    }

    const profileData = await response.json();
    const userPosts = profileData.posts || []; // The array of posts

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
          // Adjust these fields (title, body, media.url) to match your API
          const cardDiv = document.createElement("div");
          cardDiv.classList.add("card");
          cardDiv.innerHTML = `
            <div class="card-header text-center">
              <h4 class="card-title">${post.title ?? "Untitled Post"}</h4>
            </div>
            <div class="card-body text-center gap-3">
              <img src="${post.media?.url ?? "/images/default-image.jpg"}" class="card-img" alt="Post image" />
              <p class="card-text text-start py-1">${post.body ?? ""}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-primary">Edit</button>
              <button class="btn btn-danger">Delete</button>
            </div>
          `;

          // Wrap the card in a container if you want spacing, etc.
          const wrapperDiv = document.createElement("div");
          wrapperDiv.classList.add("mb-4"); // some spacing
          wrapperDiv.appendChild(cardDiv);

          postsContainer.appendChild(wrapperDiv);
        });
      }
    }
  } catch (error) {
    console.error("Error loading posts:", error);
  }
});
