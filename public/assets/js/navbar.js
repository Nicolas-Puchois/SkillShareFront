import { AuthManager } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".navbar .toggle");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      toggleBtn.classList.toggle("active");
    });
  }

  AuthManager.updateNavbar();
});
