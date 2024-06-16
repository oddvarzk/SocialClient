import { setRegisterFormListener } from "./handlers/register.mjs";
import { setLoginFormListener } from "./handlers/login.mjs";

import { createPost } from "./api/posts/create.mjs";

const path = location.pathname;

if (path === "/index.html") {
  setRegisterFormListener();
} else if (path === "/login/") {
  setLoginFormListener();
}

createPost({
  title: "Hello, world!",
  body: "Testiiiing.",
});
