import { setRegisterFormListener } from "./handlers/register.mjs";
import { setLoginFormListener } from "./handlers/login.mjs";
import * as post from "./api/posts/index.mjs";

const path = location.pathname;

if (path === "/index.html") {
  // Handle registration form
  setRegisterFormListener();
} else if (path === "/login/") {
  // Handle login form
  setLoginFormListener();
} else if (path === "/feed") {
  // Only fetch posts if on the feed page
  post.fetchPosts();  // This assumes fetchPosts is the function you use to load posts on the feed page
}
