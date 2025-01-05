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

  let filteredPosts = allPosts;
  const trimmedQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";
  if (trimmedQuery) {
    filteredPosts = allPosts.filter((post) => {
      const title = post.title?.toLowerCase() || "";
      const body = post.body?.toLowerCase() || "";
      return title.includes(trimmedQuery) || body.includes(trimmedQuery);
    });
  }

  const sortValue = sortDropdown ? sortDropdown.value : "newest";

  if (sortValue === "newest") {
    filteredPosts.sort((a, b) => new Date(b.created) - new Date(a.created));
  } else {
    filteredPosts.sort((a, b) => new Date(a.created) - new Date(b.created));
  }

  const seenImages = new Set();

  filteredPosts.forEach((post) => {
    if (!post.media?.url) {
      return;
    }
    if (seenImages.has(post.media.url)) {
      return;
    }
    seenImages.add(post.media.url);

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
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found. Prompting login.");
    if (!window.hasLoginAlerted) {
      alert("You need to login first.");
      window.hasLoginAlerted = true;
      window.location.href = "/login/";
    }
    return;
  }

  const getPostsURL = `${API_SOCIAL_URL}posts?page=${page}`;

  try {
    const response = await fetch(getPostsURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

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

    if (data && data.data) {
      allPosts = [...allPosts, ...data.data];

      const loadMoreButton = document.getElementById("load-more-button");
      if (data.meta && data.meta.isLastPage) {
        if (loadMoreButton) loadMoreButton.style.display = "none";
      } else {
        if (loadMoreButton) loadMoreButton.style.display = "inline-block";
      }

      renderPosts();
    } else {
      console.error("No posts data available in the response");
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1;
  let searchQuery = "";

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
      renderPosts();
    });
  } else {
    console.warn("Search input not found.");
  }

  fetchPosts(currentPage);
});
