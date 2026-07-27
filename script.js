const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const year = document.querySelector("#year");
const header = document.querySelector(".site-header");
const progress = document.querySelector(".page-progress");
const heroPanel = document.querySelector(".hero-panel");

// Update dynamic year
if (year) {
  year.textContent = new Date().getFullYear();
}

// Mobile menu toggle
navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close mobile menu on click
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

// Highlight active section link on scroll
const sections = [...document.querySelectorAll("main section[id]")];

const linkObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle("active", href === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

sections.forEach((section) => linkObserver.observe(section));

// Reveal elements on scroll animation
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const updateScrollState = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progressValue = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  document.documentElement.style.setProperty("--scroll-progress", progressValue.toFixed(4));
  header?.classList.toggle("scrolled", window.scrollY > 24);
};

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });

heroPanel?.addEventListener("pointermove", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const rect = heroPanel.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  heroPanel.style.setProperty("--tilt-x", `${(x - 0.5) * 7}deg`);
  heroPanel.style.setProperty("--tilt-y", `${(0.5 - y) * 7}deg`);
  heroPanel.style.setProperty("--spot-x", `${x * 100}%`);
  heroPanel.style.setProperty("--spot-y", `${y * 100}%`);
});

heroPanel?.addEventListener("pointerleave", () => {
  heroPanel.style.setProperty("--tilt-x", "0deg");
  heroPanel.style.setProperty("--tilt-y", "0deg");
  heroPanel.style.setProperty("--spot-x", "50%");
  heroPanel.style.setProperty("--spot-y", "20%");
});
