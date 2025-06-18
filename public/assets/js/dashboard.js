import { AuthManager } from "./auth.js";
import { showNotification } from "./notification.js";
import { fetchData } from "../../lib/fetchData.js";

document.addEventListener("DOMContentLoaded", async () => {
  if (!AuthManager.isAdmin()) {
    localStorage.setItem(
      "showNotification",
      "Accès non autorisé - Administrateurs uniquement"
    );
    window.location.href = "/";
    return;
  }

  if (AuthManager.isAdmin()) {
    const token = localStorage.getItem("JWTtoken");
    const API_URL =
      document.querySelector("#api-url")?.value || "http://localhost:8000/api";

    try {
      const data = await fetchData({
        route: "/users",
        api: API_URL,
        options: {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (data.success) {
        const tableBody = document.querySelector("#users-table tbody");

        data.users.forEach((user) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
                    <td>
                        <img class="user-avatar" 
                             src="${
                               user.avatar
                                 ? `${API_URL}/uploads/avatars/${user.avatar}`
                                 : "assets/images/default-avatar.png"
                             }" 
                             alt="Avatar de ${user.username}">
                    </td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.roles?.join(", ") || "Utilisateur"}</td>
                    <td>${user.isVerified ? "Oui" : "Non"}</td>
                    <td class="action-buttons">
                        <button class="edit" data-id="${
                          user._id
                        }">Éditer</button>
                        <button class="delete" data-id="${
                          user._id
                        }">Supprimer</button>
                    </td>
                `;
          tableBody.appendChild(tr);
        });
      } else {
        throw new Error(
          data.message || "Erreur lors de la récupération des utilisateurs"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("Erreur lors de la récupération des utilisateurs");
    }
  }
});
