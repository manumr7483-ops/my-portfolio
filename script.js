/* =========================================================
   PORTFOLIO JAVASCRIPT
   Handles loader, menu, theme, active navigation,
   reveal animations, and contact form validation.
   ========================================================= */

const body = document.body;
const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loaderBar");
const loaderCount = document.getElementById("loaderCount");
const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav__link");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-toggle__icon");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

/* ---------- Loading screen ---------- */
body.classList.add("loading");

let progress = 0;
const loaderTimer = setInterval(() => {
  progress += Math.floor(Math.random() * 9) + 3;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loaderTimer);

    setTimeout(() => {
      loader.classList.add("is-hidden");
      body.classList.remove("loading");
      body.classList.add("site-ready");
    }, 280);
  }

  loaderBar.style.width = `${progress}%`;
  loaderCount.textContent = progress;
}, 55);

/* ---------- Sticky header appearance ---------- */
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
});

/* ---------- Mobile navigation ---------- */
navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Theme toggle with localStorage ---------- */
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
  body.classList.add("light-mode");
  themeIcon.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
  const isLight = body.classList.toggle("light-mode");
  themeIcon.textContent = isLight ? "☀" : "☾";
  localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
});

/* ---------- Scroll reveal using IntersectionObserver ---------- */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

/* ---------- Highlight the current nav link ---------- */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => link.classList.remove("active"));
      const currentLink = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
      if (currentLink) currentLink.classList.add("active");
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

/* ---------- Contact form validation ---------- */
function showError(input, message) {
  const group = input.closest(".form-group");
  group.classList.add("error");
  group.querySelector(".form-error").textContent = message;
}

function clearError(input) {
  const group = input.closest(".form-group");
  group.classList.remove("error");
  group.querySelector(".form-error").textContent = "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  let isValid = true;
  formStatus.textContent = "";

  [name, email, message].forEach(clearError);

  if (name.value.trim().length < 2) {
    showError(name, "Please enter at least 2 characters.");
    isValid = false;
  }

  if (!isValidEmail(email.value.trim())) {
    showError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (message.value.trim().length < 10) {
    showError(message, "Please enter a message of at least 10 characters.");
    isValid = false;
  }

  if (!isValid) return;

  /*
    This demo has no backend, so it only shows success feedback.
    Connect Formspree, EmailJS, your own server, etc. later if needed.
  */
  formStatus.textContent = "Looks good! Your form is validated successfully.";
  contactForm.reset();
});

/* Clear validation errors while the user edits a field. */
document.querySelectorAll(".contact-form input, .contact-form textarea").forEach((field) => {
  field.addEventListener("input", () => clearError(field));
});

/* ---------- Dynamic footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
