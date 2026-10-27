// Every visit opens at the top: drop stale section links (e.g. a shared "#give" URL) and restored scroll.
// The inline head script normally clears the hash first; this is the fallback.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (location.hash || window.scrollY > 0) {
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  window.scrollTo({ top: 0, behavior: "instant" });
  let userMoved = false;
  const moved = () => { userMoved = true; };
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach((t) => window.addEventListener(t, moved, { once: true, passive: true }));
  window.addEventListener("load", () => {
    if (!userMoved && window.scrollY > 0) window.scrollTo({ top: 0, behavior: "instant" });
  }, { once: true });
}

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

const sunNav = document.querySelector(".sun-nav");
if (sunNav) {
  const updateSunlight = (visible) => {
    sunNav.classList.toggle("is-sunlit", visible && !document.hidden);
  };
  let sunVisible = false;
  if ("IntersectionObserver" in window) {
    const sunObserver = new IntersectionObserver(([entry]) => {
      sunVisible = entry.isIntersecting;
      updateSunlight(sunVisible);
    });
    sunObserver.observe(sunNav);
    document.addEventListener("visibilitychange", () => updateSunlight(sunVisible));
  }
  const sunSummary = sunNav.querySelector("summary");
  const closeSunNav = () => {
    if (sunNav.contains(document.activeElement)) sunSummary.focus();
    sunNav.open = false;
  };
  sunNav.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest("a[href^='#']") : null;
    if (!link) return;
    closeSunNav();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sunNav.open) closeSunNav();
  });
  document.addEventListener("click", (event) => {
    if (sunNav.open && !sunNav.contains(event.target)) closeSunNav();
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
const yearEndInput = document.getElementById("year-end-gift-amount");
const yearEndPresets = document.querySelector(".year-end-presets");
const syncYearEndPresets = () => {
  document.querySelectorAll("[data-year-end-amount]").forEach((button) => {
    button.setAttribute("aria-pressed", String(yearEndInput?.value === button.dataset.yearEndAmount));
  });
};
amountInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value) amountInputs.forEach((other) => {
      if (other !== input) other.value = "";
    });
    syncYearEndPresets();
  });
});
if (yearEndPresets && yearEndInput) {
  yearEndPresets.hidden = false;
  yearEndPresets.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest("[data-year-end-amount]") : null;
    if (!button) return;
    yearEndInput.value = button.dataset.yearEndAmount;
    yearEndInput.dispatchEvent(new Event("input", { bubbles: true }));
    yearEndInput.focus({ preventScroll: true });
  });
}
document.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest("a[href='#year-end-gift']") : null;
  if (!link || !yearEndInput || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  document.getElementById("year-end-gift").scrollIntoView({ behavior: "instant", block: "start" });
  yearEndInput.focus({ preventScroll: true });
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

  document.querySelectorAll(".donation-tier, .quick-chip, .quick-yearend-tab").forEach((el) => {
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
const quickGives = [...document.querySelectorAll(".quick-give")];
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
    const quickInView = quickGives.some((box) => { const r = box.getBoundingClientRect(); return r.top < vh * 0.8 && r.bottom > vh * 0.2; });
    const shown = pastHero && !inGive && !quickInView;
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
/* ===== Sun flight: the badge rides from the hero to a side dock as the page scrolls ===== */
const sunSlotTarget = sunNav && document.querySelector("main");
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
if (sunNav && sunSlotTarget) {
  const slot = document.createElement("div");
  slot.className = "sun-slot";
  slot.setAttribute("aria-hidden", "true");
  sunNav.before(slot);
  sunSlotTarget.before(sunNav);
  document.documentElement.classList.add("sun-flight");

  const orbitFill = sunNav.querySelector(".sun-orbit-fill");
  const sunLinks = [...sunNav.querySelectorAll(".sun-links a[href^='#']")];
  const sectionFor = (link) => {
    const target = document.querySelector(link.getAttribute("href"));
    return target && target.id !== "top" ? target.closest("section") || target : null;
  };
  const tracked = sunLinks.map((link) => [link, sectionFor(link)]).filter(([, section]) => section);
  let wasDocked = false;
  let tucked = false;
  let lastScrollY = window.scrollY;
  let flightQueued = false;

  const flySun = () => {
    flightQueued = false;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const compact = vw <= 680;
    const dockSize = compact ? 64 : vw <= 1100 ? 74 : 88;
    const slotRect = slot.getBoundingClientRect();
    const raw = clamp(window.scrollY / (vh * 0.55), 0, 1);
    const stepped = reduceMotion || motionPaused;
    const t = stepped ? (raw > 0.5 ? 1 : 0) : easeInOut(raw);
    const BASE = 112;
    const size = lerp(BASE, dockSize, t);
    const endX = compact ? 16 : vw - dockSize - (vw <= 1100 ? 16 : 28);
    const endY = compact ? vh - dockSize - 16 : vh / 2 - dockSize / 2;
    let x;
    let y;
    let s = size;
    if (compact && !stepped) {
      // Small screens: the sun sets into the hero, then rises in the corner instead of crossing the copy.
      const setting = t < 0.5;
      const phase = setting ? t * 2 : (t - 0.5) * 2;
      s = setting ? lerp(BASE, 0, phase) : lerp(0, dockSize, phase);
      const centerShift = (BASE - s) / 2;
      x = setting ? slotRect.left + centerShift : endX;
      y = setting ? slotRect.top + centerShift + phase * 40 : endY + (1 - phase) * 40;
    } else {
      const arc = stepped ? 0 : Math.sin(Math.PI * t) * Math.min(120, vh * 0.14);
      x = lerp(slotRect.left, endX, t);
      y = lerp(slotRect.top, endY, t) - arc;
    }
    const docked = t >= 0.999;
    // Tablets and phones: tuck the docked sun aside while reading downward, bring it back on scroll up.
    if (docked && vw <= 1100 && !sunNav.open && !sunNav.contains(document.activeElement)) {
      const delta = window.scrollY - lastScrollY;
      if (delta > 6) tucked = true;
      else if (delta < -6) tucked = false;
    } else {
      tucked = false;
    }
    lastScrollY = window.scrollY;

    // Read every section position before writing styles to avoid forced layouts.
    const max = document.documentElement.scrollHeight - vh;
    let current = null;
    tracked.forEach(([link, section]) => {
      const r = section.getBoundingClientRect();
      if (r.top < vh * 0.45 && r.bottom > vh * 0.25) current = link;
    });

    sunNav.classList.toggle("is-tucked", tucked);
    if (tucked) x = compact ? -dockSize - 24 : vw + 24;
    // The badge keeps a fixed 112px layout box and is scaled around its center, so flight never triggers layout.
    const k = Math.max(s / BASE, 0.001);
    const shift = (BASE / 2) * (1 - k);
    sunNav.style.transform = `translate3d(${(x - shift).toFixed(1)}px, ${(y - shift).toFixed(1)}px, 0)`;
    sunNav.style.setProperty("--sun-scale", k.toFixed(4));
    sunNav.style.setProperty("--sun-inset", `${((BASE - dockSize) / 2).toFixed(1)}px`);
    sunNav.style.setProperty("--sun-fade", clamp(1 - t * 3, 0, 1).toFixed(3));
    sunNav.style.setProperty("--sun-spin", `${stepped ? 0 : (window.scrollY * 0.12) % 360}deg`);
    sunNav.classList.toggle("is-airborne", t > 0.34);
    if (docked !== wasDocked) {
      if (sunNav.open) sunNav.open = false;
      wasDocked = docked;
    }
    sunNav.classList.toggle("is-docked", docked);

    if (orbitFill) orbitFill.style.strokeDashoffset = String(1 - (max > 0 ? window.scrollY / max : 0));
    sunLinks.forEach((link) => {
      if (link === current) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };
  const queueFlight = () => {
    if (!flightQueued) {
      flightQueued = true;
      requestAnimationFrame(flySun);
    }
  };
  window.addEventListener("scroll", queueFlight, { passive: true });
  window.addEventListener("resize", queueFlight);
  window.addEventListener("load", queueFlight);
  if (motionToggle) motionToggle.addEventListener("click", queueFlight);
  sunNav.addEventListener("focusin", queueFlight);
  flySun();
}

/* ===== Shoreline: lap only while visible ===== */
const shoreline = document.querySelector(".shoreline");
if (shoreline && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => shoreline.classList.toggle("in-view", entry.isIntersecting)).observe(shoreline);
}

/* ===== Brand bubbles: faint LifeWise and Prime Digital Connect marks drifting in the water ===== */
const bubbleMarks = {
  lifewise: '<img src="assets/lifewise-crest-white.webp?v=20261026-bubbles" width="1079" height="805" alt="" decoding="async">',
  prime: '<svg class="bb-color" viewBox="0 0 74 98" focusable="false"><rect x="0" y="1" width="24" height="96" rx="12" fill="#1d4ed8"/><circle cx="39.5" cy="33.5" r="23.5" fill="none" stroke="#e1251b" stroke-width="20"/><path fill="#fff" d="M15.5 24.5C16.3 30.6 17.6 32.4 22.5 33.5C17.6 34.6 16.3 36.4 15.5 42.5C14.7 36.4 13.4 34.6 8.5 33.5C13.4 32.4 14.7 30.6 15.5 24.5Z"/></svg>',
  primeMono: '<svg class="bb-mono" viewBox="0 0 182 175" focusable="false"><rect x="0" y="25" width="35" height="150" fill="currentColor"/><path d="M42 40H95A42.5 42.5 0 0 1 95 125H42" fill="none" stroke="currentColor" stroke-width="30"/><rect x="157" y="13" width="10" height="10" fill="currentColor"/><rect x="176" y="0" width="6" height="6" fill="currentColor"/></svg>'
};
// Each spec: [left %, top %, size factor, drift seconds, phase seconds, sway px, bob px]
const bubbleLayer = (className, specs) => `<div class="brand-bubbles ${className}" aria-hidden="true">${specs.map(([x, y, s, d, phase, dx, dy], i) => {
  const kind = i % 2 ? "prime" : "lifewise";
  return `<span class="brand-bubble is-${kind}" style="--x:${x}%;--y:${y}%;--s:${s};--d:${d}s;--phase:-${phase}s;--dx:${dx}px;--dy:${dy}px"><span class="bb-mark">${kind === "prime" && i % 4 === 3 ? bubbleMarks.primeMono : bubbleMarks[kind]}</span></span>`;
}).join("")}</div>`;
if (shoreline) {
  shoreline.insertAdjacentHTML("beforeend", bubbleLayer("shore-bubbles", [
    [6, 52, 0.9, 11, 2, 18, 7], [17, 30, 1.15, 14, 9, 24, 9], [29, 64, 0.8, 12, 5, 16, 6],
    [41, 38, 1, 15, 11, 22, 8], [56, 58, 1.2, 13, 3, 26, 7], [68, 28, 0.85, 16, 7, 18, 9],
    [80, 56, 1.05, 12, 12, 20, 6], [93, 34, 0.9, 14, 4, 16, 8]
  ]));
}

// Pop a shoreline bubble on hover or tap; it reforms after a short pause.
if (shoreline) {
  const pop = (bubble) => {
    if (!bubble || bubble.classList.contains("is-popped") || bubble.classList.contains("is-reforming")) return;
    bubble.classList.add("is-popped");
    setTimeout(() => {
      bubble.classList.replace("is-popped", "is-reforming");
      requestAnimationFrame(() => requestAnimationFrame(() => bubble.classList.remove("is-reforming")));
    }, reduceMotion ? 900 : 2600);
  };
  shoreline.addEventListener("pointerover", (e) => {
    if (e.pointerType === "mouse") pop(e.target.closest(".brand-bubble"));
  });
  shoreline.addEventListener("pointerdown", (e) => pop(e.target.closest(".brand-bubble")));
}

/* ===== Wave crash into the giving section ===== */
const crashMarkup = `
  <div class="crash-layer crash-deep"><svg viewBox="0 0 1440 1300" preserveAspectRatio="none" focusable="false"><path d="M0 170C160 90 330 60 500 110S820 210 1000 120 1300 40 1440 90V1300H0Z" fill="#0a223b"/></svg></div>
  <div class="crash-layer crash-ocean"><svg viewBox="0 0 1440 1300" preserveAspectRatio="none" focusable="false"><path d="M0 120C200 40 380 30 560 90S860 200 1060 100 1320 30 1440 70V1300H0Z" fill="#0a7fb8"/></svg></div>
  <div class="crash-layer crash-front"><svg viewBox="0 0 1440 1300" preserveAspectRatio="none" focusable="false"><defs><linearGradient id="crash-blue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00bfed"/><stop offset="0.45" stop-color="#0a9fd6"/><stop offset="1" stop-color="#0a5f94"/></linearGradient></defs><path d="M0 200C140 120 300 100 470 150S760 240 960 150 1260 70 1440 130V1300H0Z" fill="url(#crash-blue)"/><path d="M0 200C140 120 300 100 470 150S760 240 960 150 1260 70 1440 130" fill="none" stroke="#fff" stroke-width="26" stroke-linecap="round"/><g fill="#fff"><circle cx="90" cy="150" r="22"/><circle cx="260" cy="118" r="30"/><circle cx="420" cy="146" r="18"/><circle cx="610" cy="196" r="26"/><circle cx="790" cy="214" r="20"/><circle cx="980" cy="138" r="32"/><circle cx="1150" cy="98" r="22"/><circle cx="1330" cy="102" r="28"/></g><g fill="#fff" opacity="0.55"><circle cx="180" cy="230" r="9"/><circle cx="520" cy="250" r="7"/><circle cx="880" cy="270" r="10"/><circle cx="1240" cy="190" r="8"/><circle cx="700" cy="320" r="6"/><circle cx="340" cy="300" r="7"/></g></svg>${bubbleLayer("crash-bubbles", [
    [12, 30, 1, 3.2, 0.4, 26, 40], [27, 52, 1.3, 3.8, 1.1, 30, 52], [41, 24, 0.85, 3, 0.2, 22, 36],
    [55, 44, 1.15, 3.5, 1.6, 28, 48], [69, 62, 0.95, 3.3, 0.8, 24, 44], [82, 34, 1.25, 4, 1.3, 32, 56],
    [92, 56, 0.8, 2.9, 0.5, 20, 34], [20, 74, 0.9, 3.4, 1.9, 24, 40], [63, 80, 1.05, 3.6, 0.3, 26, 46]
  ])}</div>
  <div class="crash-foam"></div>
  <div class="crash-layer crash-lace"><svg viewBox="0 0 1440 1300" preserveAspectRatio="none" focusable="false"><g fill="none" stroke="#fff" stroke-linecap="round" opacity="0.8"><path d="M0 260C160 220 300 300 470 250S760 330 960 260 1260 200 1440 250" stroke-width="10"/><path d="M0 330C200 290 340 360 560 320S880 380 1060 330 1320 290 1440 320" stroke-width="5" stroke-dasharray="18 22"/></g></svg></div>`;
let waveCrash = null;
let crashing = false;
const landOnGive = () => {
  const give = document.getElementById("give");
  if (!give) return;
  const anchor = shoreline || give;
  const top = anchor.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "instant" });
  give.setAttribute("tabindex", "-1");
  give.focus({ preventScroll: true });
};
const buildCrash = () => {
  if (waveCrash) return;
  waveCrash = document.createElement("div");
  waveCrash.className = "wave-crash";
  waveCrash.setAttribute("aria-hidden", "true");
  waveCrash.innerHTML = crashMarkup;
  document.body.append(waveCrash);
};
// Parse the wave layers ahead of time so the first crash starts on a clean frame.
if (!reduceMotion && Element.prototype.animate) {
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 600));
  window.addEventListener("load", () => idle(buildCrash), { once: true });
}
const crashToGive = async () => {
  if (crashing) return;
  if (reduceMotion || motionPaused || !Element.prototype.animate) {
    landOnGive();
    return;
  }
  crashing = true;
  buildCrash();
  // Warm up the destination's lazy images while the wave rises, so the reveal doesn't hitch.
  document.querySelectorAll("#give img[loading='lazy']").forEach((img) => {
    img.loading = "eager";
    if (img.decode) img.decode().catch(() => {});
  });
  const layers = [...waveCrash.querySelectorAll(".crash-layer")];
  waveCrash.classList.add("is-crashing");
  try {
    const rise = layers.map((layer, i) => layer.animate([
      { transform: "translate3d(-7%, 110%, 0) skewX(-10deg)" },
      { transform: "translate3d(-1%, -12%, 0) skewX(3deg)", offset: 0.82 },
      { transform: "translate3d(0, -20%, 0) skewX(0deg)" }
    ], { duration: 900, delay: i * 80, easing: "cubic-bezier(0.5, 0.05, 0.3, 1)", fill: "forwards" }));
    await Promise.all(rise.map((a) => a.finished));
    const foam = waveCrash.querySelector(".crash-foam");
    const flash = foam.animate([
      { opacity: 0, transform: "scale(1.15)" },
      { opacity: 0.62, transform: "scale(1)", offset: 0.3 },
      { opacity: 0, transform: "scale(1.05) translateY(8%)" }
    ], { duration: 900, easing: "ease-out", fill: "forwards" });
    landOnGive();
    if (shoreline) {
      shoreline.classList.remove("is-washed");
      void shoreline.offsetWidth;
      shoreline.classList.add("is-washed");
    }
    // The front water pulls back first, the deeper layers trail it, and the lace foam fades last.
    const order = [2, 1, 0, 3];
    const recede = layers.map((layer, i) => layer.animate([
      { transform: "translate3d(0, -20%, 0)", opacity: 1 },
      { transform: `translate3d(${i % 2 ? 3 : -3}%, 112%, 0)`, opacity: i === 3 ? 0 : 1 }
    ], { duration: i === 3 ? 1100 : 720, delay: 120 + order.indexOf(i) * 70, easing: "cubic-bezier(0.6, 0, 0.75, 0.3)", fill: "forwards" }));
    await Promise.all(recede.concat(flash).map((a) => a.finished));
    rise.concat(recede, flash).forEach((a) => a.cancel());
  } finally {
    waveCrash.classList.remove("is-crashing");
    crashing = false;
  }
};
document.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest("a[href='#give']") : null;
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  crashToGive();
});
