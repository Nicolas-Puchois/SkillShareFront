import { fetchData } from "../../lib/fetchData.js";
import { AuthManager } from "./auth.js";
import { validateRegisterForm } from "../../services/validate.js";

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = document.querySelector("#api-url").value;
  const infoForm = document.querySelector("#info-form");
  const msg = document.querySelector("#verify-msg");
  const msgContainer = document.querySelector(".message-container");
  const submitInfoButton = infoForm.querySelector("#button-submit");
  submitInfoButton.setAttribute("disabled", true);

  if (
    !AuthManager.isLoggedIn("vous devez être connecté pour voir votre profil")
  ) {
    return;
  }

  const user = AuthManager.getUser();

  if (!user) {
    AuthManager.logout();
    return;
  }

  const usernameInput = document.querySelector("#username");
  const emailInput = document.querySelector("#email");
  // Gestion des infos actuelles du user connecté
  usernameInput.value = user.username;
  emailInput.value = user.email;

  usernameInput.addEventListener("change", () => {
    submitInfoButton.removeAttribute("disabled");
  });

  emailInput.addEventListener("change", () => {
    submitInfoButton.removeAttribute("disabled");
  });

  infoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Réinitialiser les messages d'erreurs
    infoForm
      .querySelectorAll(".error")
      .forEach((span) => (span.textContent = ""));

    const { valid, errors, data } = validateRegisterForm(infoForm);

    if (!valid) {
      for (const [field, message] of Object.entries(errors)) {
        const errorSpan = infoForm.querySelector(`[data-error="${field}"]`);
        if (errorSpan) errorSpan.textContent = message;
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
          input.classList.add("error-input");
        }
      }

      msg.textContent = "";
      return;
    }
    const infoData = new FormData(infoForm);
    const jsonData = {};
    infoData.forEach((value, key) => {
      jsonData[key] = value;
    });
    try {
      const result = await fetchData({
        route: "/api/user/update",
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
        // mise à jour du user en local
        const updatedUser = { ...user, ...jsonData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        msg.textContent = result.message;
        msg.style.color = "green";
        msgContainer.style.display = "block";
      }
    } catch (error) {
      msg.textContent = error.message;
      msg.style.color = "red";
      msgContainer.style.display = "block";
    }
  });
});
