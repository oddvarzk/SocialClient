// profile.js
import { loadObject } from "../../storage/index.mjs"; // or your correct relative path

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // 1. Load the user profile from localStorage
  const user = loadObject("profile");

  // 2. If user data is missing, redirect or alert
  if (!user) {
    alert("No user profile found. Please log in first.");
    window.location.href = "/login/";
    return;
  }

  // 3. Update the DOM with user data
  // Example: fill in the username, email, avatar, etc.

  // 3a. Avatar image
  const avatarImg = document.querySelector("img[alt='Profile Image']");
  if (avatarImg) {
    // If your API returns something like user.avatar.url, adjust as needed
    avatarImg.src = user.avatar?.url ?? "/images/profile-user.svg";
  }

  // 3b. Username (the <span> that currently says "Example00")
  const usernameSpan = document.querySelector(".profile-info:nth-of-type(1)");
  // Alternatively, give your <span> a unique class or ID so you can query it better
  if (usernameSpan) {
    usernameSpan.textContent = user.name ?? "UnknownUser";
  }

  // 3c. Email (the <span> that currently says "Example@noroff.no")
  const emailSpan = document.querySelector(".profile-info:nth-of-type(2)");
  if (emailSpan) {
    emailSpan.textContent = user.email ?? "No Email Provided";
  }

  // 3d. If you have "Posts: <span class="profile-info">3</span>",
  // you can show the number of posts from the user object (if available)
  const postsSpan = document.querySelector(".profile-info:nth-of-type(3)");
  if (postsSpan) {
    // Suppose user._count.posts or user.posts is how the API returns the count
    postsSpan.textContent = user._count?.posts ?? 0;
  }
});
