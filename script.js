const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

if (menuToggle && siteNav) {
  const closeMenu = (restoreFocus = false) => {
    if (restoreFocus && siteNav.contains(document.activeElement)) menuToggle.focus();
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu(true);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu(true);
    }
  });
}

const revealTargets = document.querySelectorAll(
  ".program-section > :not(.morph-field), .local-section > :not(.morph-field):not(.county-stamp), .volunteer-section > :not(.morph-field), .values-band li, .donation-tiers li, .questions-section > :not(.morph-field)"
);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let motionPaused = reduceMotion;
const motionToggle = document.querySelector(".motion-toggle");
if (motionToggle && !reduceMotion) {
  motionToggle.hidden = false;
  motionToggle.addEventListener("click", () => {
    motionPaused = !motionPaused;
    document.documentElement.classList.toggle("motion-paused", motionPaused);
    motionToggle.setAttribute("aria-pressed", String(motionPaused));
    motionToggle.textContent = motionPaused ? "Resume animations" : "Pause animations";
    document.querySelectorAll("svg").forEach((svg) => {
      if (motionPaused) svg.pauseAnimations();
      else svg.unpauseAnimations();
    });
  });
}
if (reduceMotion) document.querySelectorAll("svg animate").forEach((el) => el.remove());

const amountInputs = document.querySelectorAll(".other-amount input[name='amount']");
amountInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value) amountInputs.forEach((other) => {
      if (other !== input) other.value = "";
    });
  });
});

if ("IntersectionObserver" in window && !reduceMotion && revealTargets.length) {
  document.documentElement.classList.add("reveal-ready");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    observer.observe(el);
  });
}

const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
progressBar.setAttribute("aria-hidden", "true");
document.body.append(progressBar);
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.setProperty("--progress", max > 0 ? window.scrollY / max : 0);
};
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
window.addEventListener("load", updateProgress);
updateProgress();

/* ===== Motion v2 ===== */
const finePointer = window.matchMedia("(pointer: fine)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const splitWords = (el) => {
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.append(part);
            return;
          }
          const word = document.createElement("span");
          word.className = "word";
          const inner = document.createElement("span");
          inner.className = "word-inner";
          inner.textContent = part;
          inner.style.setProperty("--i", i++);
          word.append(inner);
          frag.append(word);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(el);
};

if (!reduceMotion) {
  const headings = document.querySelectorAll("h1, main h2");
  headings.forEach(splitWords);
  const heroTitle = document.querySelector(".hero h1");
  requestAnimationFrame(() => requestAnimationFrame(() => heroTitle && heroTitle.classList.add("words-in")));

  if ("IntersectionObserver" in window) {
    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("words-in");
          headingObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    headings.forEach((h) => { if (h !== heroTitle) headingObserver.observe(h); });
  } else {
    headings.forEach((h) => h.classList.add("words-in"));
  }
}

/* Smoothed pointer tracking shared by the hero and giving section */
const trackPointer = (el, apply) => {
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const step = () => {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    apply(cx, cy);
    raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(step) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
  el.addEventListener("pointermove", (e) => {
    if (motionPaused) return;
    const r = el.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width - 0.5;
    ty = (e.clientY - r.top) / r.height - 0.5;
    kick();
  });
  el.addEventListener("pointerleave", () => { tx = 0; ty = 0; kick(); });
};

if (finePointer && !reduceMotion) {
  const hero = document.querySelector(".hero");
  if (hero) {
    trackPointer(hero, (x, y) => {
      hero.style.setProperty("--mx", x.toFixed(4));
      hero.style.setProperty("--my", y.toFixed(4));
    });
  }

  const give = document.querySelector(".give-section");
  if (give) {
    trackPointer(give, (x, y) => {
      give.style.setProperty("--sx", `${((x + 0.5) * 100).toFixed(1)}%`);
      give.style.setProperty("--sy", `${((y + 0.5) * 100).toFixed(1)}%`);
    });
  }

  document.querySelectorAll(".button, .nav-give, .donate-pill").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      if (motionPaused) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--tx", `${clamp((e.clientX - r.left - r.width / 2) * 0.22, -10, 10).toFixed(1)}px`);
      el.style.setProperty("--ty", `${clamp((e.clientY - r.top - r.height / 2) * 0.28, -8, 8).toFixed(1)}px`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.removeProperty("--tx");
      el.style.removeProperty("--ty");
    });
  });

  document.querySelectorAll(".donation-tier").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      if (motionPaused) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${((x - 0.5) * 12).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    });
  });
}

/* Morph fields: animate only while visible, drift with scroll */
const morphFields = [...document.querySelectorAll(".morph-field")];
if ("IntersectionObserver" in window) {
  const fieldObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle("in-view", entry.isIntersecting));
  }, { rootMargin: "120px" });
  morphFields.forEach((f) => fieldObserver.observe(f));
} else {
  morphFields.forEach((f) => f.classList.add("in-view"));
}

const pill = document.querySelector(".donate-pill");
const heroEl = document.querySelector(".hero");
const giveEl = document.querySelector(".give-section");
let ticking = false;

const onScroll = () => {
  ticking = false;
  const vh = window.innerHeight;
  if (!motionPaused) {
    morphFields.forEach((field) => {
      if (!field.parentElement || field.parentElement.classList.contains("hero")) return;
      const r = field.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      field.style.setProperty("--py", `${(p * -60).toFixed(1)}px`);
    });
  }
  if (pill && heroEl && giveEl) {
    const pastHero = heroEl.getBoundingClientRect().bottom < vh * 0.15;
    const giveRect = giveEl.getBoundingClientRect();
    const inGive = giveRect.top < vh * 0.7 && giveRect.bottom > vh * 0.2;
    const shown = pastHero && !inGive;
    pill.classList.toggle("is-shown", shown);
    pill.setAttribute("aria-hidden", String(!shown));
    pill.tabIndex = shown ? 0 : -1;
  }
};

window.addEventListener("scroll", () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(onScroll);
  }
}, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();