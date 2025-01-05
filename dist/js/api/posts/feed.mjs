// /src/js/api/posts/feed.mjs

import { API_SOCIAL_URL, API_KEY } from "../../api/constants.mjs";

let allPosts = []; // Global array to store posts

/**
 * Renders posts to the DOM based on current filters and sorting.
 */
function renderPosts() {
  const postsContainer = document.getElementById("posts-container");
  const sortDropdown = document.getElementById("sort-dropdown");
  const searchInput = document.getElementById("search-input");

  if (!postsContainer) {
    console.warn("Posts container not found.");
    return;
  }

  postsContainer.innerHTML = "";

  // 1) Filter by the search query
  let filteredPosts = allPosts;
  const trimmedQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";
  if (trimmedQuery) {
    filteredPosts = allPosts.filter((post) => {
      const title = post.title?.toLowerCase() || "";
      const body = post.body?.toLowerCase() || "";
      return title.includes(trimmedQuery) || body.includes(trimmedQuery);
    });
  }

  // 2) Determine the sort order from the dropdown
  const sortValue = sortDropdown ? sortDropdown.value : "newest";

  // 3) Sort the filtered array by "created" date
  if (sortValue === "newest") {
    // Descending date => newest first
    filteredPosts.sort((a, b) => new Date(b.created) - new Date(a.created));
  } else {
    // Ascending date => oldest first
    filteredPosts.sort((a, b) => new Date(a.created) - new Date(b.created));
  }

  // 4) Keep track of which image URLs we've already shown
  const seenImages = new Set();

  // 5) Loop through the filtered+sorted posts and create cards
  filteredPosts.forEach((post) => {
    // Skip if no media URL
    if (!post.media?.url) {
      return;
    }
    // If we've already rendered this image URL, skip
    if (seenImages.has(post.media.url)) {
      return;
    }
    // Mark this image URL as seen
    seenImages.add(post.media.url);

    // Create the post card
    const postCard = document.createElement("div");
    postCard.classList.add("py-5", "px-3");
    postCard.innerHTML = `
      <div class="d-flex justify-content-center">
        <a href="/post/?id=${encodeURIComponent(post.id)}">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title text-center">${post.title}</h4>
            </div>
            <div class="card-footer d-flex px-3 justify-content-center">
              <img class="card-user-image" src="${
                post.author?.avatar?.url || "/images/profile-user.svg"
              }" alt="${post.author?.name || "User Avatar"}">
              <p class="card-username py-2 px-2">${
                post.author?.name || "Unknown User"
              }</p>
            </div>
            <div class="card-body mx-auto">
              <img class="card-image px-3" src="${
                post.media.url
              }" alt="Post image">
              <p class="card-text px-3">${post.body}</p>
            </div>
          </div>
        </a>
      </div>
    `;
    postsContainer.appendChild(postCard);
  });
}

/**
 * Fetches posts from the API and updates the DOM.
 * @param {number} page - The page number to fetch.
 */
export async function fetchPosts(page = 1) {
  const token = localStorage.getItem("token"); // Get JWT token from localStorage

  if (!token) {
    console.log("No token found. Prompting login.");
    if (!window.hasLoginAlerted) {
      alert("You need to login first.");
      window.hasLoginAlerted = true; // Set a flag
      window.location.href = "/login/";
    }
    return;
  }

  const getPostsURL = `${API_SOCIAL_URL}posts?page=${page}`;

  try {
    // Make the API call to fetch posts
    const response = await fetch(getPostsURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // JWT token
        "X-Noroff-API-Key": API_KEY,      // API key
        "Content-Type": "application/json",
      },
    });

    // If unauthorized, alert the user and redirect
    if (response.status === 401) {
      console.log("Unauthorized response received.");
      if (!window.hasLoginAlerted) {
        alert("Unauthorized: Please login again.");
        window.hasLoginAlerted = true;
        window.location.href = "/login/";
      }
      return;
    }

    const data = await response.json();

    // Check if the data contains posts
    if (data && data.data) {
      // Merge newly fetched posts into the global array
      allPosts = [...allPosts, ...data.data];

      // Handle pagination / load-more button
      const loadMoreButton = document.getElementById("load-more-button");
      if (data.meta && data.meta.isLastPage) {
        if (loadMoreButton) loadMoreButton.style.display = "none";
      } else {
        if (loadMoreButton) loadMoreButton.style.display = "inline-block";
      }

      // Now render them with the current sort order (and search/duplicate checks)
      renderPosts();
    } else {
      console.error("No posts data available in the response");
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

// Event listener for DOMContentLoaded to set up event handlers
document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1;
  let searchQuery = "";

  // Grab references to DOM elements
  const loadMoreButton = document.getElementById("load-more-button");
  const sortDropdown = document.getElementById("sort-dropdown");
  const searchInput = document.getElementById("search-input");

  /**
   * Handles "Load More" button clicks.
   */
  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      currentPage += 1;
      fetchPosts(currentPage);
    });
  } else {
    console.warn("Load More button not found.");
  }

  /**
   * Handles sort dropdown changes.
   */
  if (sortDropdown) {
    sortDropdown.addEventListener("change", () => {
      renderPosts();
    });
  } else {
    console.warn("Sort dropdown not found.");
  }

  /**
   * Handles search input changes.
   */
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      searchQuery = event.target.value;
      renderPosts(); // Re-render to apply search + sort + duplicates skip
    });
  } else {
    console.warn("Search input not found.");
  }

  // Initial call to load page 1
  fetchPosts(currentPage);
});
