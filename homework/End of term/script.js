const backToTopButton = document.querySelector(".back-to-top");

function updateBackToTop() {
  if (window.scrollY > 420) {
    backToTopButton.classList.add("is-visible");
  } else {
    backToTopButton.classList.remove("is-visible");
  }
}

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();
