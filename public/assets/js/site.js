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
  // Data-saver and slow (2G/3G) connections keep the photo.
  var conn = navigator.connection || {};
  var slowNet = /(^|-)2g$|^3g$/.test(conn.effectiveType || "");
  if (heroVideo && !reduceMotion && !saveData && !slowNet) {
    // iOS only autoplays inline video that is muted and playsinline as properties too.
    heroVideo.muted = true; heroVideo.defaultMuted = true; heroVideo.playsInline = true;
    heroVideo.setAttribute("muted", ""); heroVideo.setAttribute("playsinline", ""); heroVideo.setAttribute("webkit-playsinline", "");
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

  /* Photo uploads on quote forms
     Each photo is resized in the browser (max 1600px JPEG) and uploaded to
     /api/upload (Vercel Blob). The links are kept on the form and sent with the
     lead to /api/quote, which attaches the photos to {{contact.add_photos}}. */
  var UPLOAD_URL = "/api/upload", MAX_PHOTOS = 5;
  function resizePhoto(file) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
        var c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * scale); c.height = Math.round(img.naturalHeight * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { resolve(b && b.size < file.size ? b : file); }, "image/jpeg", 0.82);
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(file); }; // e.g. HEIC on non-Apple browsers
      img.src = url;
    });
  }
  document.querySelectorAll(".field--photos").forEach(function (wrap) {
    var input = wrap.querySelector(".photo-input"), list = wrap.querySelector(".photo-list");
    var form = wrap.closest("form");
    var items = [];
    function sync() {
      form.dataset.photos = JSON.stringify(items.filter(function (i) { return i.url; }).map(function (i) { return i.url; }));
      var uploading = items.some(function (i) { return i.status === "uploading"; });
      var failed = items.some(function (i) { return i.status === "error"; });
      form.dataset.uploading = uploading ? "1" : "";
      form.dataset.photoErrors = failed ? "1" : "";
      wrap.classList.toggle("is-full", items.length >= MAX_PHOTOS);
      if (!failed) wrap.classList.remove("is-invalid");
      if (!uploading && form.dataset.pendingSubmit) {
        delete form.dataset.pendingSubmit;
        if (typeof form.requestSubmit === "function") form.requestSubmit(); else sendQuote(form);
      }
    }
    function add(file) {
      var item = { status: "uploading", url: "" }, li = document.createElement("li"), thumb = new Image(), rm = document.createElement("button");
      li.className = "is-uploading";
      thumb.alt = ""; thumb.src = URL.createObjectURL(file);
      rm.type = "button"; rm.setAttribute("aria-label", "Remove photo"); rm.textContent = "×";
      rm.addEventListener("click", function () { items.splice(items.indexOf(item), 1); li.remove(); sync(); });
      li.appendChild(thumb); li.appendChild(rm); list.appendChild(li);
      items.push(item); sync();
      resizePhoto(file).then(function (blob) {
        var name = (file.name || "photo").replace(/\.[^.]*$/, "") + (blob.type === "image/jpeg" ? ".jpg" : "");
        return fetch(UPLOAD_URL + "?name=" + encodeURIComponent(name), { method: "POST", headers: { "content-type": blob.type || "image/jpeg" }, body: blob });
      }).then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); }).then(function (d) {
        item.url = d.url; item.status = "done"; li.className = "is-done";
      }).catch(function () {
        item.status = "error"; li.className = "is-error";
      }).then(sync);
    }
    input.addEventListener("change", function () {
      Array.prototype.slice.call(input.files || [], 0, MAX_PHOTOS - items.length)
        .filter(function (f) { return /^image\//.test(f.type) || /\.(heic|heif)$/i.test(f.name); })
        .forEach(add);
      input.value = "";
    });
  });

  /* Quote forms
     Submissions go to /api/quote, which creates/updates the GHL contact with
     every field and photo, then adds the "website-quote" tag (the workflow
     trigger). Honeypot and validation run first; bots are quietly sent to the
     thank-you page without anything being sent. */
  var THANK_YOU = "/thank-you", QUOTE_URL = "/api/quote";
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
  function setBusy(form, text) {
    var btn = form.querySelector("[type=submit]");
    if (!btn) return;
    var label = btn.querySelector("span");
    if (!btn.dataset.label) btn.dataset.label = label.textContent;
    if (text) { btn.setAttribute("aria-busy", "true"); btn.disabled = true; label.textContent = text; }
    else { btn.removeAttribute("aria-busy"); btn.disabled = false; label.textContent = btn.dataset.label; }
  }
  function sendQuote(form) {
    var data = {};
    ["full_name", "email", "phone", "property_address", "property_size", "service_needed", "job_notes", "gcl_hp_check"].forEach(function (n) {
      var el = form.querySelector("[name=" + n + "]"); data[n] = el ? el.value.trim() : "";
    });
    try { data.photos = JSON.parse(form.dataset.photos || "[]"); } catch (err) { data.photos = []; }
    var errBox = form.querySelector(".form-error");
    if (errBox) errBox.hidden = true;
    form.dataset.sending = "1";
    setBusy(form, "Sending…");
    fetch(QUOTE_URL, { method: "POST", keepalive: true, headers: { "content-type": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); })
      .then(function () {
        try { sessionStorage.setItem("gcl_first_name", data.full_name.split(/\s+/)[0] || ""); } catch (err) {}
        window.location.href = THANK_YOU;
      })
      .catch(function () {
        delete form.dataset.sending;
        setBusy(form, "");
        if (errBox) errBox.hidden = false;
      });
  }
  document.querySelectorAll("form.js-quote").forEach(function (form) {
    form.addEventListener("input", function (e) {
      var w = fieldWrap(e.target);
      if (w && w.classList.contains("is-invalid")) { w.classList.remove("is-invalid"); e.target.setAttribute("aria-invalid", "false"); }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.dataset.sending) return;
      setBusy(form, "");
      var hp = form.querySelector(".hp-field input");
      if (hp && hp.value.trim() !== "") { window.location.href = THANK_YOU; return; } // bot: send nothing
      if (!validate(form)) return;
      if (form.dataset.photoErrors) {
        var pw = form.querySelector(".field--photos"); if (pw) pw.classList.add("is-invalid");
        return;
      }
      if (form.dataset.uploading) {
        // Wait for photos to finish; the uploader re-submits the form when done.
        form.dataset.pendingSubmit = "1";
        setBusy(form, "Uploading photos…");
        return;
      }
      sendQuote(form);
    });
  });

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
