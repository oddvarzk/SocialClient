// /src/js/api/posts/createPost.mjs

import { createPost } from "../create.mjs"; // Adjust the path if necessary

export function initializeCreatePost() {
  console.log("initializeCreatePost called");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleCreatePost);
  } else {
    // DOM is already loaded
    handleCreatePost();
  }

  function handleCreatePost() {
    console.log("Handling Create Post setup.");

    const form = document.getElementById("createPost");
    if (!form) {
      console.error("Create Post form with id 'createPost' not found.");
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent the default form submission

      // Gather form data
      const title = form.postTitle.value.trim();
      const description = form.postDescription.value.trim();
      const imageUrl = form.postImage.value.trim();
      const label = form.postLabel.value.trim();

      // Validate form data
      if (!title || !description) {
        alert("Please provide both a title and a description for your post.");
        return;
      }

      // Optional: Further validation (e.g., image URL format)

      const postData = {
        title,
        body: description,
        media: imageUrl ? { url: imageUrl } : null,
        tags: label ? [label] : [],
      };

      console.log("Submitting post data:", postData);

      try {
        const response = await createPost(postData);
        if (response) {
          alert("Post created successfully!");
          // Optionally, redirect to the Feed page
          window.location.href = "/feed/";
          // Alternatively, reset the form
          // form.reset();
        } else {
          alert("Failed to create post. Please try again.");
        }
      } catch (error) {
        console.error("Error during post creation:", error);
        alert("An error occurred while creating the post. Please try again.");
      }
    });
  }
}
