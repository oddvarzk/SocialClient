import { API_SOCIAL_URL, API_KEY } from '../../api/constants.mjs';

/**
 * Fetch and display posts from the API.
 * @param {number} page - The current page to fetch.
 */
async function fetchPosts(page = 1) {
  const token = localStorage.getItem('token'); // Get JWT token from localStorage
  if (!token) {
    alert("You need to login first.");
    return;
  }

  const getPostsURL = `${API_SOCIAL_URL}posts?page=${page}`;

  try {
    // Make the API call to fetch posts
    const response = await fetch(getPostsURL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // JWT token for user authorization
        'X-Noroff-API-Key': API_KEY,         // API key for API access
        'Content-Type': 'application/json'   // Set the content type as JSON
      }
    });

    // If unauthorized, alert the user
    if (response.status === 401) {
      alert('Unauthorized: Please login again');
      return;
    }

    const data = await response.json();

    console.log(data);
    // Check if the data contains posts (data.data should exist)
    if (data && data.data) {
      const postsContainer = document.getElementById('posts-container');

      // Loop through posts and create cards
      data.data.forEach(post => {
        // Skip the post if it doesn't have a media URL
        if (!post.media?.url) {
          return;
        }

        const postCard = document.createElement('div');
        postCard.classList.add('py-5', 'px-3');
        postCard.innerHTML = `
          <div class="d-flex justify-content-center">
            <a href="/post/${post.id}">
              <div class="card">
                <div class="card-header">
                  <h4 class="card-title text-center">${post.title}</h4>
                </div>
                <div class="card-footer d-flex px-3 justify-content-center">
                  <img class="card-user-image" src="${post.author?.avatar?.url || '/images/profile-user.svg'}">
                  <p class="card-username py-2 px-2">${post.author?.name || 'Unknown User'}</p>
                </div>
                <div class="card-body mx-auto">
                  <img class="card-image px-3" src="${post.media.url}" alt="Post image">
                  <p class="card-text px-3">${post.body}</p>
                </div>
              </div>
            </a>
          </div>
        `;
        postsContainer.appendChild(postCard);
      });

      // Handle pagination: If it's the last page, hide the "See more" button
      const loadMoreButton = document.getElementById('load-more-button');
      if (data.meta.isLastPage) {
        loadMoreButton.style.display = 'none';
      } else {
        loadMoreButton.style.display = 'inline-block';
        loadMoreButton.addEventListener('click', () => fetchPosts(page + 1)); // Load the next page of posts
      }
    } else {
      console.error('No posts data available in the response');
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}
console.log(fetchPosts);
// Initial call to load posts
fetchPosts();
