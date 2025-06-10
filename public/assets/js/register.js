import { validateRegisterForm } from "../../services/validate.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("#register-form");
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    registerForm
      .querySelectorAll(".error")
      //    réinitialisation des champs erreurs a vides
      .forEach((span) => (span.textContent = ""));
    // Validation des donnée
    const { valid, errors } = validateRegisterForm(registerForm);
  });
});
