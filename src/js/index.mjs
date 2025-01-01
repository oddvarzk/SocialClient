// /src/js/index.mjs

import { setRegisterFormListener } from "./handlers/register.mjs";
import { setLoginFormListener } from "./handlers/login.mjs";

// Function to normalize path by removing trailing slashes
function normalizePath(path) {
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

// Get the current path
const path = location.pathname;
const normalizedPath = normalizePath(path);

// Initialize scripts based on the normalized path
switch (normalizedPath) {
  case "/index.html":
  case "/":
    setRegisterFormListener();
    break;

  case "/login":
  case "/login/":
    setLoginFormListener();
    break;

  case "/feed":
  case "/feed/":
    import("./api/posts/feed.mjs")
      .then(({ initializeFeed }) => {
        initializeFeed();
      })
      .catch(error => {
        console.error("Error loading feed.mjs:", error);
      });
    break;

  case "/profile":
  case "/profile/":
    import("../js/profile/index.mjs")
      .then(({ initializeProfile }) => {
        initializeProfile();
      })
      .catch(error => {
        console.error("Error loading profile.mjs:", error);
      });
    break;

  case "/post/create":
  case "/post/create/":
    import("./api/posts/createPost/index.mjs")
      .then(({ initializeCreatePost }) => {
        initializeCreatePost();
      })
      .catch(error => {
        console.error("Error loading createPost.mjs:", error);
      });
    break;

  // Add more cases as needed for other pages

  default:
    console.warn(`No handler defined for path: ${path}`);
}
