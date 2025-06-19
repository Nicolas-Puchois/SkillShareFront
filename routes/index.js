import express from "express";
const router = express.Router();

const globals = {
  API_URL: process.env.API_URL || "http://localhost:8000/api",
};

router.get("/", (req, res) => {
  res.render("layout", { title: "Accueil", view: "pages/home" });
});

router.get("/inscription", (req, res) => {
  res.render("layout", {
    title: "Inscription",
    view: "pages/register",
    ...globals,
  });
});

router.get("/verify-email", (req, res) => {
  res.render("layout", {
    title: "Vérification email",
    view: "pages/verify-email",
    ...globals,
  });
});

router.get("/connexion", (req, res) => {
  res.render("layout", {
    title: "Connexion",
    view: "pages/connexion",
    ...globals,
  });
});

router.get("/skills", (req, res) => {
  res.render("layout", {
    title: "Les Competences",
    view: "pages/skills",
    ...globals,
  });
});

router.get("/dashboard", (req, res) => {
  res.render("layout", {
    title: "Les Dashboards",
    view: "pages/dashboard",
    ...globals,
  });
});

router.get("/profil", (req, res) => {
  res.render("layout", {
    title: "Profil",
    view: "pages/profil",
    ...globals,
  });
});

// Ajouter cette route en dernier
router.use((req, res) => {
  res.status(404).render("layout", {
    title: "404 - Page non trouvée",
    view: "pages/404",
    ...globals,
  });
});

export default router;
