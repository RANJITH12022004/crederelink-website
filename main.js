/* =============================================================
   CREDERELINK FINTECH — main.js  v5
   GSAP scroll-triggered SPA · dark-first
   ============================================================= */
"use strict";

/* ── THEME ──────────────────────────────────────────────────── */
(function () {
  const toggle = document.getElementById("themeToggle");
  const html   = document.documentElement;
  function applyTheme(t) {
    html.setAttribute("data-theme", t);
    try { localStorage.setItem("cl-theme", t); } catch (_) {}
  }
  if (toggle) {
    toggle.addEventListener("click", () =>
      applyTheme(html.getAttribute("data-theme") === "light" ? "dark" : "light")
    );
  }
})();

/* ── MOBILE NAV ─────────────────────────────────────────────── */
(function () {
  const btn = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });
  nav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      btn.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    })
  );
  document.addEventListener("click", e => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      btn.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    }
  });
})();

/* ── HEADER SCROLL ──────────────────────────────────────────── */
(function () {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  let ticking = false;
  function update() {
    header.classList.toggle("scrolled", window.scrollY > 60);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

/* ── SECTION PROGRESS DOTS ──────────────────────────────────── */
(function () {
  const dots    = document.querySelectorAll(".sp-dot");
  const secIds  = ["home","services","features","about","contact"];
  dots.forEach(d => d.addEventListener("click", () => {
    document.getElementById(d.dataset.target)?.scrollIntoView({ behavior: "smooth" });
  }));
  secIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        dots.forEach(d => d.classList.remove("active"));
        dots[i]?.classList.add("active");
      }
    }, { threshold: 0.25 }).observe(el);
  });
})();

/* ── SCROLLSPY ──────────────────────────────────────────────── */
(function () {
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  const secIds   = ["home","services","features","about","contact"];
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      navLinks.forEach(a => a.classList.toggle("active", a.dataset.section === id));
      history.replaceState(null, "", id === "home" ? location.pathname : "#" + id);
    });
  }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });
  secIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();

/* ── SERVICES TOC ───────────────────────────────────────────── */
(function () {
  const tocLinks = document.querySelectorAll(".services-toc a");
  const blocks   = document.querySelectorAll(".service-block[id]");
  if (!tocLinks.length || !blocks.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      tocLinks.forEach(a =>
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id)
      );
    });
  }, { rootMargin: "-25% 0px -65% 0px" });
  blocks.forEach(b => obs.observe(b));
})();

/* ── WORD SPLIT ─────────────────────────────────────────────── */
function splitWords(element) {
  const words = element.textContent.split(/\s+/).filter(Boolean);
  element.innerHTML = words
    .map(w => `<span class="word-wrap"><span class="word">${w}</span></span>`)
    .join(" ");
  return element.querySelectorAll(".word");
}

/* ── SHOW ALL CONTENT (crawlers, reduced-motion, GSAP fallback) ─ */
function showAllContent() {
  document.querySelectorAll(
    ".gsap-fade,.gsap-up,.gsap-left,.gsap-right,.gsap-scale,.word"
  ).forEach(el => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
  document.querySelectorAll(".eyebrow").forEach(e => e.classList.add("animated"));
  document.querySelectorAll(".process-step").forEach(e => e.classList.add("revealed"));
  document.getElementById("processTrack")?.classList.add("line-done");
  document.querySelectorAll(".value-card").forEach(e => e.classList.add("revealed"));
  document.querySelectorAll(".tl-item").forEach(e => e.classList.add("done"));
  document.querySelectorAll(
    "#services .service-head, #services .service-cta, #services .chip, #services .offering, #services .section-head"
  ).forEach(el => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}

function isSearchCrawler() {
  return /googlebot|google-inspectiontool|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebot|facebookexternalhit|twitterbot|linkedinbot/i.test(
    navigator.userAgent
  );
}

/* ── CONTACT FORM (FormSubmit — free, no backend) ─────────── */
(function () {
  const form   = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;
  const FORM_URL = "https://formsubmit.co/ajax/info@crederelinkfintech.com";

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className   = "form-status visible " + (type === "ok" ? "ok" : "err");
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (form.querySelector("[name='_honey']")?.value) return;

    let valid = true;
    form.querySelectorAll("[required]").forEach(f => {
      if (f.type === "checkbox" ? !f.checked : !f.value.trim()) valid = false;
    });
    if (!valid) { setStatus("Please fill in all required fields and accept the consent checkbox.", "err"); return; }

    const btn = form.querySelector("[type='submit']");
    btn.disabled = true; btn.textContent = "Sending…";

    const data = Object.fromEntries(new FormData(form).entries());
    const subjectLabel = data.subject
      ? form.querySelector("#subject option:checked")?.textContent?.trim() || data.subject
      : "General enquiry";
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || "—",
      subject: subjectLabel,
      message: data.message,
      _subject: `Crederelink website: ${subjectLabel} — ${data.name}`,
      _replyto: data.email,
      _template: "table",
      _captcha: "false",
    };

    try {
      const res  = await fetch(FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      const ok   = json.success === true || json.success === "true";

      if (ok) {
        setStatus("Thank you. We'll be in touch within one business day.", "ok");
        form.reset();
      } else if (json.message && /activat/i.test(json.message)) {
        setStatus(
          "One-time setup: check info@crederelinkfintech.com (and spam) for a FormSubmit activation email, click the link, then submit again.",
          "err"
        );
      } else {
        throw new Error(json.message || "Submission failed");
      }
    } catch (err) {
      const n   = data.name || "";
      const em  = data.email || "";
      const sub = subjectLabel;
      const msg = data.message || "";
      setStatus("Could not send online — opening your email app as a backup…", "err");
      setTimeout(() => {
        window.location.href =
          "mailto:info@crederelinkfintech.com?subject=" +
          encodeURIComponent("Website enquiry: " + sub) +
          "&body=" +
          encodeURIComponent("Name: " + n + "\nEmail: " + em + "\nPhone: " + (data.phone || "—") + "\nSubject: " + sub + "\n\n" + msg);
      }, 900);
    } finally {
      const b = form.querySelector("[type='submit']");
      if (b) { b.disabled = false; b.textContent = "Send message"; }
    }
  });
})();

/* ══════════════════════════════════════════════════════════════
   GSAP ANIMATIONS
   Strategy: gsap.from() reads current CSS as the "to" target.
   CSS has NO opacity:0 on .gsap-* classes, so the natural "to"
   state is always visible (opacity:1, transform:none).
   If GSAP never loads → elements remain visible by default.
══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {

  /* Crawlers and reduced-motion: skip scroll animations so content is visible */
  if (isSearchCrawler() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    showAllContent();
    return;
  }

  /* Poll for GSAP CDN to finish loading (defer attribute) */
  function initGSAP() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      setTimeout(initGSAP, 80);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    runAnimations();
  }
  initGSAP();

  function runAnimations() {

    /* Scroll-linked reveal — progress follows how far the user has scrolled */
    const REVEAL = {
      start: "top bottom",   /* begins when element enters the viewport */
      end:   "top 50%",      /* completes once element is centred in view */
      scrub: 1.1,            /* slight lag — pace follows scroll speed */
    };

    function reveal(targets, vars, opts) {
      const list = gsap.utils.toArray(targets).filter(el => !el.closest("#services"));
      if (!list.length) return;
      const trigger = opts?.trigger || list[0];
      /* Transform-only reveals — never hide opacity (Googlebot must read content) */
      gsap.from(list, {
        ease: "none",
        ...vars,
        scrollTrigger: {
          trigger,
          start: opts?.start ?? REVEAL.start,
          end:   opts?.end   ?? REVEAL.end,
          scrub: opts?.scrub ?? REVEAL.scrub,
          invalidateOnRefresh: true,
        },
      });
    }

    /* ─── 1. EYEBROW LINES (fire only when heading is in view) ─── */
    document.querySelectorAll(".eyebrow").forEach(el =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 72%",
        once: true,
        onEnter: () => el.classList.add("animated"),
      })
    );

    /* ─── 2. HERO — slow entrance on load, not scroll-linked ─── */
    const heroTitle = document.getElementById("heroTitle");
    const heroTl    = gsap.timeline({ defaults: { ease: "power4.out" } });

    if (heroTitle) {
      const words = splitWords(heroTitle);
      heroTl.from(words, { y: 40, duration: 1.2, stagger: 0.11 }, 0.2);
    }

    heroTl
      .from("#heroKicker",    { y: 22, duration: 1.1 }, 0)
      .from(".hero-lede",     { y: 28, duration: 1.1 }, 0.8)
      .from(".hero-actions",  { y: 28, duration: 1.05 }, 1.0)
      .from(".hero-trust",    { y: 22, duration: 1.0 }, 1.2);

    /* ─── 3. GENERIC SCROLL REVEALS ─────────────────────────── */
    const BATCH_SELECTORS = [
      ".pillar-card", ".feature-card", ".value-card",
      ".offering", ".tl-item", ".process-step", ".feature-row",
    ];

    function isHandledByBatch(el) {
      return BATCH_SELECTORS.some(sel => el.matches(sel));
    }

    gsap.utils.toArray(".gsap-up").forEach(el => {
      if (el.closest("#home") || el.closest("#services") || isHandledByBatch(el)) return;
      reveal(el, { y: 44 });
    });

    gsap.utils.toArray(".gsap-left").forEach(el => {
      if (el.closest("#home") || el.closest("#services") || isHandledByBatch(el)) return;
      reveal(el, { x: -36 });
    });

    gsap.utils.toArray(".gsap-right").forEach(el => {
      if (el.closest("#home") || el.closest("#contact") || isHandledByBatch(el)) return;
      reveal(el, { x: 36 });
    });

    gsap.utils.toArray(".gsap-fade").forEach(el => {
      if (el.closest("#home") || el.closest("#services") || isHandledByBatch(el)) return;
      reveal(el, { y: 20 });
    });

    gsap.utils.toArray(".gsap-scale").forEach(el => {
      if (el.closest("#home") || el.closest("#services") || isHandledByBatch(el)) return;
      reveal(el, { scale: 0.9 });
    });

    /* ─── 4. PILLAR CARDS ───────────────────────────────────── */
    document.querySelectorAll(".pillar-grid").forEach(grid => {
      reveal(grid.querySelectorAll(".pillar-card"), { y: 52, stagger: 0.09 }, { trigger: grid });
    });

    /* ─── 5. FEATURE CARDS ──────────────────────────────────── */
    document.querySelectorAll(".feature-card-grid").forEach(grid => {
      reveal(grid.querySelectorAll(".feature-card"), { y: 46, stagger: 0.08 }, { trigger: grid });
    });

    /* ─── 6. VALUES GRID ──────────────────────────────────── */
    document.querySelectorAll(".values-grid").forEach(grid => {
      const cards = grid.querySelectorAll(".value-card");
      reveal(cards, { y: 38, stagger: 0.07 }, { trigger: grid });
      ScrollTrigger.create({
        trigger: grid,
        start: "top 60%",
        once: true,
        onEnter: () => cards.forEach(c => c.classList.add("revealed")),
      });
    });

    /* ─── 7. OFFERING CARDS (services section stays always visible) ─ */
    document.querySelectorAll(".offering-grid").forEach(grid => {
      if (grid.closest("#services")) return;
      reveal(grid.querySelectorAll(".offering"), { y: 32, stagger: 0.07 }, { trigger: grid });
    });

    /* ─── 8. FEATURE ROWS ───────────────────────────────────── */
    document.querySelectorAll(".feature-list").forEach(list => {
      reveal(list.querySelectorAll(".feature-row"), { x: -32, stagger: 0.1 }, { trigger: list });
    });

    /* ─── 9. PROCESS RAIL ───────────────────────────────────── */
    const track = document.getElementById("processTrack");
    if (track) {
      const steps = track.querySelectorAll(".process-step");
      reveal(steps, { y: 36, stagger: 0.1 }, { trigger: track });
      ScrollTrigger.create({
        trigger: track,
        start: "top 65%",
        once: true,
        onEnter: () => {
          track.classList.add("line-done");
          steps.forEach(s => s.classList.add("revealed"));
        },
      });
    }

    /* ─── 10. TIMELINE ITEMS ────────────────────────────────── */
    document.querySelectorAll(".tl-item").forEach(item => {
      reveal(item, { x: -28 });
      ScrollTrigger.create({
        trigger: item,
        start: "top 62%",
        once: true,
        onEnter: () => item.classList.add("done"),
      });
    });

    /* ─── 11. CHIP GRIDS (services section stays always visible) ─ */
    document.querySelectorAll(".chip-grid").forEach(cg => {
      if (cg.closest("#services")) return;
      reveal(cg.querySelectorAll(".chip"), { scale: 0.92, stagger: 0.04 }, {
        trigger: cg,
        end: "top 58%",
      });
    });

    /* ─── 12. CONTACT MAP ───────────────────────────────────── */
    const contactMap = document.querySelector("#contact .map-frame");
    if (contactMap) reveal(contactMap, { y: 32 });

    /* ─── 13. CEO QUOTE MARK ────────────────────────────────── */
    const qMark = document.querySelector(".ceo-quote-mark");
    if (qMark) reveal(qMark, { scale: 0.6, end: "top 55%" });

    /* ─── 14. DATA-COUNT COUNTERS (one-shot, strict threshold) ─ */
    document.querySelectorAll("[data-count]").forEach(el => {
      const target   = parseFloat(el.dataset.count);
      const suffix   = el.dataset.suffix   || "";
      const decimals = parseInt(el.dataset.decimals || 0);
      ScrollTrigger.create({
        trigger: el,
        start: "top 68%",
        once: true,
        onEnter: () => gsap.to({ v: 0 }, {
          v: target,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: function () {
            el.textContent = this.targets()[0].v.toFixed(decimals) + suffix;
          },
        }),
      });
    });

    /* Services content must never be hidden by scroll animations */
    document.querySelectorAll(
      "#services .service-head, #services .service-cta, #services .chip, #services .offering, #services .section-head"
    ).forEach(el => gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: "transform,opacity" }));

    ScrollTrigger.refresh(true);
  } // end runAnimations

  // Re-check scroll triggers when landing on a hash (e.g. #contact)
  window.addEventListener("hashchange", () => {
    if (typeof ScrollTrigger !== "undefined") {
      setTimeout(() => ScrollTrigger.refresh(true), 120);
    }
  });

  if (location.hash && typeof ScrollTrigger !== "undefined") {
    setTimeout(() => ScrollTrigger.refresh(true), 200);
  }
});
