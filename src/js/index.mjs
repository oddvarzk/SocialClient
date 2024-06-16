import { setRegisterFormListener } from "./handlers/register.mjs";
import { setLoginFormListener } from "./handlers/login.mjs";
import * as post from "./api/posts/index.mjs";

const path = location.pathname;

if (path === "/index.html") {
  setRegisterFormListener();
} else if (path === "/login/") {
  setLoginFormListener();
}
