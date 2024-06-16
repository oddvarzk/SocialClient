import { setRegisterFormListener } from "./handlers/register.mjs";
import { setLoginFormListener } from "./handlers/login.mjs";

const path = location.pathname;

if (path === "/index.html") {
  setRegisterFormListener();
} else if (path === "/login/") {
  setLoginFormListener();
}
