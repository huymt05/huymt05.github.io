const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const year = document.querySelector("#year");
const header = document.querySelector(".site-header");
const progress = document.querySelector(".page-progress");
const heroPanel = document.querySelector(".hero-panel");
const introCard = document.querySelector(".personal-intro");

document.documentElement.classList.add("motion-enabled");

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

// Reveal headings and cards in a paced sequence, inspired by UIT's section entrances.
const revealGroups = [
  {
    root: "#home",
    items: [".eyebrow", "h1", ".hero-text", ".personal-intro", ".hero-actions", ".quick-links", ".hero-panel"]
  },
  { root: "#about", items: [".section-heading", ".about-grid > *"] },
  { root: "#skills", items: [".section-heading", ".skill-card"] },
  { root: "#projects", items: [".section-heading", ".project-card"] },
  { root: ".timeline-section", items: [".section-heading", ".timeline-item"] },
  { root: "#contact", items: ["#contact > *"] }
];

revealGroups.forEach(({ root, items }) => {
  const container = document.querySelector(root);

  if (!container) {
    return;
  }

  container.classList.add("reveal-group");
  const elements = items.flatMap((selector) => [...container.querySelectorAll(selector)]);

  elements.forEach((element, index) => {
    element.classList.add("motion-reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index * 85, 425)}ms`);

    if (element === heroPanel || (index % 3 === 2 && !element.matches(".section-heading"))) {
      element.classList.add("reveal-from-right");
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px"
  }
);

document.querySelectorAll(".motion-reveal").forEach((element) => {
  revealObserver.observe(element);
});

const updateScrollState = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progressValue = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  document.documentElement.style.setProperty("--scroll-progress", progressValue.toFixed(4));
  document.documentElement.style.setProperty("--grid-offset", `${Math.min(window.scrollY * 0.055, 42)}px`);
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

introCard?.addEventListener("pointermove", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const rect = introCard.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  introCard.style.setProperty("--intro-tilt-x", `${(x - 0.5) * 5}deg`);
  introCard.style.setProperty("--intro-tilt-y", `${(0.5 - y) * 5}deg`);
  introCard.style.setProperty("--intro-shift-x", `${(x - 0.5) * 4}px`);
  introCard.style.setProperty("--intro-shift-y", `${(y - 0.5) * 4}px`);
  introCard.style.setProperty("--intro-spot-x", `${x * 100}%`);
  introCard.style.setProperty("--intro-spot-y", `${y * 100}%`);
  introCard.style.setProperty("--intro-cursor-scale", "1");
});

introCard?.addEventListener("pointerleave", () => {
  introCard.style.setProperty("--intro-tilt-x", "0deg");
  introCard.style.setProperty("--intro-tilt-y", "0deg");
  introCard.style.setProperty("--intro-shift-x", "0px");
  introCard.style.setProperty("--intro-shift-y", "0px");
  introCard.style.setProperty("--intro-spot-x", "50%");
  introCard.style.setProperty("--intro-spot-y", "45%");
  introCard.style.setProperty("--intro-cursor-scale", "0.72");
});
