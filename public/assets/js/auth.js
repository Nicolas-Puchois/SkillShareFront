export class AuthManager {
  static isLoggedIn() {
    const token = localStorage.getItem("JWTtoken");
    const notAllowedPaths = ["%2Fskills"];
    const adminPaths = ["%2Fdashboard"];

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
    const currentPath = encodeURIComponent(window.location.pathname);
    if (adminPaths.includes(currentPath) && !this.isAdmin()) {
      localStorage.setItem(
        "showNotification",
        "Accès non autorisé - Administrateurs uniquement"
      );
      window.location.href = "/";
      return false;
    }

    if (!token) {
      if (notAllowedPaths.includes(currentPath)) {
        window.location.href = `/connexion?redirect=${currentPath}`;
      }
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
        <li><a href="/profil">Profil</a></li>
        ${isAdmin ? '<li><a href="/dashboard">Dashboard</a></li>' : ""}
        <li><a href="/skills">Skills</a></li>
        <li><a href="#" id="logout-btn">Logout</a></li>
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
        payload.role &&
        Array.isArray(payload.role) &&
        payload.role.includes("ROLE_ADMIN")
      );
    } catch (error) {
      return false;
    }
  }
}
