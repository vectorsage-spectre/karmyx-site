/* Karmyx site script: config links, mobile menu, Mentalist colour wall. No dependencies. */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");
  var cfg = window.SITE_CONFIG || {};

  /* ---- Config-driven links and text ---- */
  function cfgValue(path) {
    return path.split(".").reduce(function (o, k) { return o && o[k] != null ? o[k] : undefined; }, cfg);
  }
  document.querySelectorAll("[data-config-href]").forEach(function (el) {
    var key = el.getAttribute("data-config-href");
    var v = cfgValue(key);
    if (!v) { if (el.hasAttribute("data-hide-if-empty")) el.closest("li").hidden = true; return; }
    if (key === "EMAIL") v = "mailto:" + v;
    else if (key === "PHONE") v = "tel:" + String(v).replace(/[^\d+]/g, "");
    el.setAttribute("href", v);
  });
  document.querySelectorAll("[data-config-text]").forEach(function (el) {
    var v = cfgValue(el.getAttribute("data-config-text"));
    if (v) el.textContent = v;
  });
  var ids = document.querySelector(".footer-legal-ids");
  if (ids) {
    var parts = [];
    if (cfg.LEGAL_NAME) parts.push(cfg.LEGAL_NAME);
    if (cfg.GSTIN) parts.push("GSTIN " + cfg.GSTIN);
    ids.textContent = parts.join(", ");
  }
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); }
    });
  }

  /* ---- Mentalist colour wall ---- */
  var hero = document.querySelector(".hero");
  var group = document.querySelector(".swatches");
  if (!hero || !group) return;

  var img = document.getElementById("tee-img");
  var cta = document.getElementById("shop-colour");
  var nameEl = document.querySelector(".picker-name");
  var ctaColour = cta.querySelector(".cta-colour");
  var swatches = Array.prototype.slice.call(group.querySelectorAll(".swatch"));
  var base = (cfg.STORE_URL || "https://shop.karmyx.co.in") + "/products/unisex-oversized-classic-t-shirt?variant=";
  var dir = "assets/images/products/mentalist-";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Warm the cache so swapping feels instant
  var warmed = false;
  function warm() {
    if (warmed) return; warmed = true;
    swatches.forEach(function (s) { var i = new Image(); i.src = dir + s.dataset.slug + "-480.webp"; });
  }
  group.addEventListener("pointerenter", warm, { once: true });
  group.addEventListener("focusin", warm, { once: true });

  function select(sw, focus) {
    swatches.forEach(function (s) {
      var on = s === sw;
      s.setAttribute("aria-checked", String(on));
      s.tabIndex = on ? 0 : -1;
    });
    if (focus) sw.focus();
    var name = sw.dataset.name, slug = sw.dataset.slug;
    hero.style.setProperty("--tee", sw.style.getPropertyValue("--c"));
    nameEl.textContent = name;
    ctaColour.textContent = name;
    cta.href = base + sw.dataset.variant;

    var apply = function () {
      img.srcset = dir + slug + "-480.webp 480w, " + dir + slug + "-900.webp 600w";
      img.src = dir + slug + "-900.webp";
      img.alt = "Mentalist oversized tee in " + name + ", back view with the blue and yellow spray-paint Mentalist graphic";
    };
    if (reduce) { apply(); return; }
    img.classList.add("is-swapping");
    setTimeout(function () {
      apply();
      var done = function () { img.classList.remove("is-swapping"); };
      if (img.complete) requestAnimationFrame(done); else img.addEventListener("load", done, { once: true });
    }, 180);
  }

  swatches.forEach(function (s, i) {
    s.tabIndex = s.getAttribute("aria-checked") === "true" ? 0 : -1;
    s.addEventListener("click", function () { select(s, false); });
    s.addEventListener("keydown", function (e) {
      var k = e.key, n = swatches.length, j = null;
      if (k === "ArrowRight" || k === "ArrowDown") j = (i + 1) % n;
      else if (k === "ArrowLeft" || k === "ArrowUp") j = (i - 1 + n) % n;
      else if (k === "Home") j = 0;
      else if (k === "End") j = n - 1;
      if (j !== null) { e.preventDefault(); select(swatches[j], true); }
    });
  });
})();
