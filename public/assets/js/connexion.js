import { fetchData } from "../../lib/fetchData.js";
import { validateRegisterForm } from "../../services/validate.js";
import { AuthManager } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  //  redirigé si déjà connecté
  if (AuthManager.isLoggedIn()) {
    // window.location.href = "/";
    return;
  }
  const loginForm = document.querySelector("#login-form");
  const API_URL = document.querySelector("#api-url").value;
  const message = document.querySelector("#verify-msg");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    loginForm
      .querySelectorAll(".error")
      .forEach((span) => (span.textContent = ""));

    //  etat de chargement ...

    loginForm
      .querySelectorAll(".error-input")
      .forEach((input) => input.classList.remove("error-input"));
    // Validation des donnée
    const { valid, errors } = validateRegisterForm(loginForm);

    if (!valid) {
      for (const [field, message] of Object.entries(errors)) {
        const errorSpan = loginForm.querySelector(`[data-error="${field}"]`);
        const input = document.querySelector(`[name="${field}"]`);
        if (errorSpan) errorSpan.textContent = message;
        if (input) {
          input.classList.add("error-input");
        }
      }
      return;
    }

    const formData = new FormData(loginForm);

    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const result = await fetchData({
        route: "/login",
        api: API_URL,
        options: {
          method: "POST",
          body: JSON.stringify(jsonData),
        },
      });

      if (!result.success) {
        throw new Error(result.error);
      }
      if (result.success) {
        localStorage.setItem("JWTtoken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        // Ajouter un flag pour la notification
        localStorage.setItem("showNotification", "Connexion réussie !");
        // Redirection immédiate
        AuthManager.updateNavbar();
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect") || "/";
        window.location.href = redirect;
      }
    } catch (error) {
      message.textContent = error.message;
      message.style.color = "red";
    }
  });
});
