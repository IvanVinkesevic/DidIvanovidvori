// Glatki scroll za navigacijske linkove
document.querySelectorAll(".nav-links a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    const headerHeight = document.querySelector("nav").offsetHeight;
    const targetPosition =
      targetElement.getBoundingClientRect().top +
      window.pageYOffset -
      headerHeight -
      20;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  });
});

// klasa za fade-in efekt pri skrolanju
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Primijeni fade-in efekt na sve članke
document.querySelectorAll(".clanak").forEach((clanak) => {
  clanak.style.opacity = "0";
  clanak.style.transform = "translateY(20px)";
  clanak.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(clanak);
});
