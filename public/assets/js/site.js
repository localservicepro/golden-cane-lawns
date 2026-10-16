/* Golden Cane Lawns — site behaviour. No dependencies. */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);

  /* Header shadow + mobile action bar */
  var header = document.querySelector(".site-header");
  var bar = document.querySelector(".action-bar");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (bar) bar.classList.toggle("is-visible", y > 420);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile drawer */
  var drawer = document.getElementById("drawer");
  var toggle = document.querySelector(".menu-toggle");
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("no-scroll", open);
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { var f = drawer.querySelector(".drawer__close"); if (f) f.focus(); }
    else if (toggle) toggle.focus();
  }
  if (toggle) toggle.addEventListener("click", function () { setDrawer(true); });
  if (drawer) {
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]") || e.target.closest("nav a")) setDrawer(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) setDrawer(false);
    });
  }

  /* Scroll reveal + counters */
  var revealEls = document.querySelectorAll("[data-reveal]");
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = (el.getAttribute("data-count").split(".")[1] || "").length;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target.toFixed(dec) + suffix; return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        if (en.target.hasAttribute("data-count")) runCounter(en.target);
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
    counters.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
    counters.forEach(runCounter);
  }

  /* Before / after sliders (pointer, touch and keyboard via the range input) */
  document.querySelectorAll(".ba").forEach(function (ba) {
    var input = ba.querySelector("input[type=range]");
    if (!input) return;
    function set(v) { ba.style.setProperty("--pos", v + "%"); }
    input.addEventListener("input", function () { set(input.value); });
    set(input.value);
    // Gentle hint animation the first time a slider scrolls into view.
    if (!reduceMotion && "IntersectionObserver" in window) {
      var hinted = false;
      new IntersectionObserver(function (es, o) {
        es.forEach(function (en) {
          if (!en.isIntersecting || hinted) return;
          hinted = true; o.disconnect();
          var t0 = null;
          (function anim(ts) {
            if (!t0) t0 = ts;
            var p = (ts - t0) / 1600;
            if (p >= 1 || input.dataset.touched) { if (!input.dataset.touched) { input.value = 50; set(50); } return; }
            var v = 50 + Math.sin(p * Math.PI * 2) * 18;
            input.value = v; set(v);
            requestAnimationFrame(anim);
          })(performance.now());
        });
      }, { threshold: 0.5 }).observe(ba);
      input.addEventListener("pointerdown", function () { input.dataset.touched = "1"; });
      input.addEventListener("keydown", function () { input.dataset.touched = "1"; });
    }
  });

  /* Hero video: poster image paints first (LCP), video streams in after load */
  var heroVideo = document.querySelector(".hero__media video[data-src]");
  if (heroVideo && !reduceMotion && !saveData) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        var sources = JSON.parse(heroVideo.getAttribute("data-src"));
        sources.forEach(function (s) {
          var el = document.createElement("source");
          el.src = s.src; el.type = s.type; heroVideo.appendChild(el);
        });
        heroVideo.addEventListener("playing", function () { heroVideo.classList.add("is-playing"); }, { once: true });
        heroVideo.load();
        var p = heroVideo.play();
        if (p && p.catch) p.catch(function () { /* autoplay blocked: poster image stays */ });
      }, 400);
    });
  }

  /* Lazy, in-view-only playback for looping videos (service area map) */
  var lazyVideos = document.querySelectorAll("video[data-lazy]");
  if (lazyVideos.length && "IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (!v.dataset.loaded) {
            v.querySelectorAll("source[data-src]").forEach(function (s) { s.src = s.getAttribute("data-src"); });
            v.load(); v.dataset.loaded = "1";
          }
          if (!reduceMotion) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { rootMargin: "200px 0px", threshold: 0.15 });
    lazyVideos.forEach(function (v) { vio.observe(v); });
  }

  /* Gallery lightbox */
  var lb = document.getElementById("lightbox");
  if (lb && typeof lb.showModal === "function") {
    var lbImg = lb.querySelector("img"), lbCap = lb.querySelector("p");
    document.querySelectorAll(".gallery figure").forEach(function (fig) {
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      function open() {
        var img = fig.querySelector("img");
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;
        lbCap.textContent = img.alt;
        lb.showModal();
      }
      fig.addEventListener("click", open);
      fig.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest("button")) lb.close(); });
  }

  /* Quote popup: any link to "#quote" opens the form in a dialog (not on Contact,
     which has no popup and keeps the in-page form). */
  var modal = document.getElementById("quote-modal");
  if (modal && typeof modal.showModal === "function") {
    var lastTrigger = null;
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href$="#quote"]');
      if (!a) return;
      e.preventDefault();
      lastTrigger = a;
      if (drawer && drawer.classList.contains("is-open")) setDrawer(false);
      modal.showModal();
      document.body.classList.add("no-scroll");
      var first = modal.querySelector("input:not([tabindex='-1'])");
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60);
    });
    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-modal-close]")) { modal.close(); return; }
      if (e.target !== modal) return;
      // Click on the backdrop (outside the card) closes it.
      var r = modal.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) modal.close();
    });
    modal.addEventListener("close", function () {
      document.body.classList.remove("no-scroll");
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    });
  }

  /* Quote forms
     The GoHighLevel external tracking script captures native form submissions,
     so the form never posts anywhere itself. Order of operations:
       1. window capture phase (runs before any other listener): honeypot and
          validation. Bots and invalid forms are stopped here so they are never
          tracked. The honeypot input is then disabled so it is not sent.
       2. the tracking script's own submit listener records the lead.
       3. window bubble phase (runs last): prevent the default navigation and
          redirect to /thank-you once the tracker has had time to send. */
  var THANK_YOU = "/thank-you";
  function fieldWrap(input) { return input.closest(".field"); }
  function validate(form) {
    var ok = true, first = null;
    form.querySelectorAll("[data-required]").forEach(function (input) {
      var v = (input.value || "").trim(), good = v.length > 0;
      if (good && input.type === "email") good = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      if (good && input.type === "tel") good = v.replace(/[^\d]/g, "").length >= 8;
      var w = fieldWrap(input);
      if (w) w.classList.toggle("is-invalid", !good);
      input.setAttribute("aria-invalid", good ? "false" : "true");
      if (!good) { ok = false; if (!first) first = input; }
    });
    if (first) first.focus();
    return ok;
  }
  document.querySelectorAll("form.js-quote").forEach(function (form) {
    form.addEventListener("input", function (e) {
      var w = fieldWrap(e.target);
      if (w && w.classList.contains("is-invalid")) { w.classList.remove("is-invalid"); e.target.setAttribute("aria-invalid", "false"); }
    });
  });
  window.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form.classList || !form.classList.contains("js-quote")) return;
    var hp = form.querySelector(".hp-field input");
    if (hp && hp.value.trim() !== "") {
      // Bot: swallow silently and behave as if it worked.
      e.preventDefault(); e.stopImmediatePropagation();
      window.location.href = THANK_YOU;
      return;
    }
    if (!validate(form)) { e.preventDefault(); e.stopImmediatePropagation(); return; }
    if (hp) hp.disabled = true;
    var btn = form.querySelector("[type=submit]");
    if (btn) { btn.setAttribute("aria-busy", "true"); btn.querySelector("span").textContent = "Sending…"; }
    try {
      var name = (form.querySelector("[name=full_name]") || {}).value || "";
      sessionStorage.setItem("gcl_first_name", name.trim().split(/\s+/)[0] || "");
    } catch (err) { /* storage unavailable */ }
  }, true);
  window.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form.classList || !form.classList.contains("js-quote")) return;
    e.preventDefault();
    setTimeout(function () { window.location.href = THANK_YOU; }, 1500);
  }, false);

  /* Thank-you personalisation */
  var thanksName = document.querySelector("[data-first-name]");
  if (thanksName) {
    try {
      var n = sessionStorage.getItem("gcl_first_name");
      if (n) thanksName.textContent = ", " + n.replace(/[<>]/g, "");
    } catch (err) {}
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
