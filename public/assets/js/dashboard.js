import { AuthManager } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  if (!AuthManager.isAdmin()) {
    localStorage.setItem(
      "showNotification",
      "Accès non autorisé - Administrateurs uniquement"
    );
    window.location.href = "/"; // La redirection empêche l'exécution du reste du code
    return; // Important pour s'assurer que le code suivant ne s'exécute pas
  }
  // Code spécifique au dashboard ici...
});
