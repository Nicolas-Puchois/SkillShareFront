export class AuthManager {
  static isLoggedIn() {
    const token = localStorage.getItem("JWTtoken");
    const currentPath = window.location.pathname;
    const notAllowedPaths = ["/skills", "/profil"];
    const adminPaths = ["%2Fdashboard"];

    // Vérifie si la page nécessite une connexion
    if (!token && notAllowedPaths.includes(currentPath)) {
      localStorage.setItem(
        "showNotification",
        "Vous devez être connecté pour accéder à cette page"
      );

      window.location.href = `/connexion?redirect=${encodeURIComponent(
        currentPath
      )}`;

      return false;
    }

    if (token && this.isTokenExpired(token)) {
      localStorage.setItem(
        "showNotification",
        "Session expirée, veuillez vous reconnecter"
      );
      this.logout();
      window.location.href = "/connexion";
      return false;
    }

    // Vérifie si la page est réservée aux admins
    const encodedPath = encodeURIComponent(window.location.pathname);
    if (adminPaths.includes(encodedPath) && !this.isAdmin()) {
      localStorage.setItem(
        "showNotification",
        "Accès non autorisé - Administrateurs uniquement"
      );
      window.location.href = "/";
      return false;
    }

    return true;
  }

  static getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  static updateNavbar() {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) {
      console.log("Element <ul> non trouvé");
      return;
    }

    const isLoggedIn = this.isLoggedIn();
    const user = this.getUser();
    const isAdmin = this.isAdmin(); // Plus besoin de passer le token

    if (isLoggedIn && user) {
      navLinks.innerHTML = `
        <li><a href="/profil"> ${
          isAdmin
            ? '<i class="fa-solid fa-user-shield"></i>'
            : '<i class="fa-solid fa-circle-user"></i>'
        } Profil</a></li>
        ${
          isAdmin
            ? '<li><a href="/dashboard"><i class="fas fa-table-cells"></i>Dashboard</a></li>'
            : ""
        }
        <li><a href="/skills"><i class="fas fa-medal"></i>Skills</a></li>
        <li><a href="#" id="logout-btn"><i class="fas fa-plug-circle-xmark"></i>Logout</a></li>
      `;

      // gestion deconnexion
      const logoutBtn = document.querySelector("#logout-btn");
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("showNotification", "Déconnexion réussie !");
        this.logout();
        window.location.href = "/connexion";
      });
    }
  }

  static logout() {
    localStorage.removeItem("JWTtoken");
    localStorage.removeItem("user");
  }

  static isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  static isAdmin() {
    const token = localStorage.getItem("JWTtoken");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return (
        payload.roles &&
        Array.isArray(payload.roles) &&
        payload.roles.includes("ROLE_ADMIN")
      );
      // Changement de 'role' en 'roles' pour correspondre au format du token
    } catch (error) {
      console.error("Erreur parsing token:", error);
      return false;
    }
  }
}
