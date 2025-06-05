document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".navbar .toggle");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      toggleBtn.classList.toggle("active");
    });
  }
});
