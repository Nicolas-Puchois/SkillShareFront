export class AuthManager {
  static isLoggedIn() {
    // return !!localStorage.getItem("JWTtoken");
    const token = localStorage.getItem("JWTtoken");
    if (!token || this.isTokenExpire()) {
      const currentPath = encodeURIComponent(window.location.pathname);
      this.logout();
      window.location.href = `/connexion?redirect=${currentPath}`;
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

    if (isLoggedIn && user) {
      navLinks.innerHTML = `
            <li><a href="/profil"> Profil </a></li>
            <li><a href="/skills"> Skills </a></li>
            <li><a href="#" id="logout-btn"> Logout </a></li>
        `;

      // gestion deconnexion

      const logoutBtn = document.querySelector("#logout-btn");
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
        window.location.href = "/connexion";
      });
    }
  }

  static logout() {
    localStorage.removeItem("JWTtoken");
    localStorage.removeItem("user");
    // Ajouter le message de notification avant la redirection
    localStorage.setItem("showNotification", "Déconnexion réussie !");
  }
}
