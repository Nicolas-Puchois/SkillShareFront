export function validateRegisterForm(form) {
  const formData = new FormData(form);
  const errors = {};
  if (formData.get("username") != null && !formData.get("username").trim())
    errors.username = "Le nom d'utilisateur est requis";
  //  regex validation email
  const emailRegex = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
  );
  const email = formData.get("email").trim();
  if (!emailRegex.test(email)) {
    errors.email = "L'Email est invalide. Email valide : test@monmail.com";
  }
  const passwordRegexPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]{12,}$/;
  const strongPasswordRegex = new RegExp(passwordRegexPattern);
  const password = formData.get("password").trim();
  if (!strongPasswordRegex.test(password)) {
    errors.password =
      " Mot de passe invalide : 12 caractères minimum, 1 majuscule, 1 chiffre, 1 caractère spécial";
  }

  if (formData.get("avatar")) {
    const file = formData.get("avatar");
    const maxSize = 2 * 1024 * 1024;
    let errorsAvatarTab = [];

    if (file.name && !file.type.match(/^image\/(gif|png|jpg|webp)$/)) {
      errorsAvatarTab.push("Fichier non valide [gif|png|jpg|webp]");
    }
    if (file.name && file.size > maxSize) {
      errorsAvatarTab.push(`Fichier trop volumineux [max: 2MB]`);
    }
    if (errorsAvatarTab.length > 0) {
      errors.avatar = errorsAvatarTab.join(" || ");
      console.log(errors.avatar);
    }
  }
  return {
    valid: Object.keys(errors).length == 0,
    errors,
  };
}
