/* Karmyx — main.js (vanilla, no dependencies) */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.remove("no-js");

  /* ---- Config-driven links and text ---------------------------------- */
  function cfgValue(path) {
    return path.split(".").reduce(function (o, k) { return o ? o[k] : undefined; }, cfg);
  }
  document.querySelectorAll("[data-config-href]").forEach(function (el) {
    var key = el.getAttribute("data-config-href");
    var val = cfgValue(key);
    if (key === "EMAIL" && val) val = "mailto:" + val;
    if (key === "PHONE" && val) val = "tel:" + val.replace(/\s+/g, "");
    if (val) el.setAttribute("href", val);
    else if (el.hasAttribute("data-hide-if-empty")) el.closest("li, [data-hide-wrap]")?.remove();
  });
  document.querySelectorAll("[data-config-text]").forEach(function (el) {
    var val = cfgValue(el.getAttribute("data-config-text"));
    if (val) el.textContent = val;
  });

  // Legal name / GSTIN only appear when filled in
  var legalIds = document.querySelector(".footer-legal-ids");
  if (legalIds) {
    var parts = [];
    if (cfg.LEGAL_NAME_PLACEHOLDER) parts.push(cfg.LEGAL_NAME_PLACEHOLDER);
    if (cfg.GSTIN_PLACEHOLDER) parts.push("GSTIN: " + cfg.GSTIN_PLACEHOLDER);
    legalIds.textContent = parts.join(" · ");
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Theme toggle --------------------------------------------------- */
  var themeBtn = document.querySelector(".theme-toggle");
  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function syncThemeLabel() {
    if (themeBtn) themeBtn.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
  }
  if (themeBtn) {
    syncThemeLabel();
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("karmyx-theme", next); } catch (e) { /* storage unavailable */ }
      syncThemeLabel();
    });
  }

  /* ---- Header: scrolled state ----------------------------------------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile menu ---------------------------------------------------- */
  var menuBtn = document.querySelector(".menu-toggle");
  var nav = document.getElementById("primary-nav");
  function setMenu(open) {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuBtn.focus();
      }
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---- Scroll reveal -------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal, .steps");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Hero parallax (pointer, desktop only) -------------------------- */
  var heroVisual = document.querySelector(".hero-visual");
  if (heroVisual && !reduceMotion && window.matchMedia("(hover: hover) and (min-width: 960px)").matches) {
    var items = heroVisual.querySelectorAll("[data-depth]");
    var raf = null;
    heroVisual.closest(".hero").addEventListener("pointermove", function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        var r = heroVisual.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) / r.width;
        var y = (e.clientY - (r.top + r.height / 2)) / r.height;
        items.forEach(function (it) {
          var d = parseFloat(it.getAttribute("data-depth"));
          it.style.transform = "translate3d(" + (x * d * 30).toFixed(1) + "px," + (y * d * 30).toFixed(1) + "px,0)";
        });
        raf = null;
      });
    });
  }

  /* ---- Product filters ------------------------------------------------ */
  var filterBtns = document.querySelectorAll(".filter-chip");
  var cards = document.querySelectorAll(".product-card");
  var filterStatus = document.getElementById("filter-status");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      var shown = 0;
      cards.forEach(function (card) {
        var cats = (card.getAttribute("data-category") || "").split(" ");
        var match = f === "all" || cats.indexOf(f) !== -1;
        card.classList.toggle("is-hidden", !match);
        card.classList.remove("is-entering");
        if (match) {
          shown++;
          void card.offsetWidth; // restart entrance animation
          card.classList.add("is-entering");
        }
      });
      if (filterStatus) filterStatus.textContent = "Showing " + shown + " product" + (shown === 1 ? "" : "s");
    });
  });

  /* ---- Quick view dialog ---------------------------------------------- */
  var dialog = document.getElementById("quick-view");
  if (dialog && typeof dialog.showModal === "function") {
    var qvImg = dialog.querySelector(".qv-media img");
    var qvMedia = dialog.querySelector(".qv-media");
    var qvTitle = dialog.querySelector("#qv-title");
    var qvDesc = dialog.querySelector(".qv-desc");
    var qvPrice = dialog.querySelector(".qv-price");
    var lastTrigger = null;
    document.querySelectorAll(".quick-view").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".product-card");
        var img = card.querySelector(".product-media img");
        lastTrigger = btn;
        qvImg.src = img.getAttribute("src");
        qvImg.alt = img.getAttribute("alt");
        qvMedia.style.setProperty("--tint", card.style.getPropertyValue("--tint"));
        qvTitle.textContent = card.querySelector("h3").textContent;
        qvDesc.textContent = card.getAttribute("data-long") || card.querySelector(".product-desc").textContent;
        qvPrice.innerHTML = card.querySelector(".price").innerHTML;
        dialog.showModal();
      });
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
    });
    dialog.addEventListener("close", function () { if (lastTrigger) lastTrigger.focus(); });
  } else {
    document.querySelectorAll(".quick-view").forEach(function (b) { b.hidden = true; });
  }

  /* ---- FAQ: smooth open/close for <details> --------------------------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var summary = item.querySelector("summary");
    var body = item.querySelector(".faq-answer");
    if (!summary || !body || reduceMotion || !body.animate) return;
    summary.addEventListener("click", function (e) {
      e.preventDefault();
      if (item.open) {
        var anim = body.animate([{ height: body.offsetHeight + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 250, easing: "ease" });
        anim.onfinish = function () { item.open = false; };
      } else {
        item.open = true;
        body.animate([{ height: "0px", opacity: 0 }, { height: body.offsetHeight + "px", opacity: 1 }], { duration: 300, easing: "ease" });
      }
    });
  });

  /* ---- Contact form --------------------------------------------------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var statusEl = form.querySelector(".form-status");
    var submitBtn = form.querySelector("[type=submit]");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var rules = {
      name: function (v) { return v.trim().length >= 2 || "Please tell us your name."; },
      email: function (v) { return emailRe.test(v.trim()) || "Please enter a valid email address."; },
      phone: function (v) { return !v.trim() || /^[+\d][\d\s-]{6,16}$/.test(v.trim()) || "Please enter a valid phone number, or leave it blank."; },
      interest: function (v) { return !!v || "Please choose what you're interested in."; },
      message: function (v) { return v.trim().length >= 10 || "A few more words, please (at least 10 characters)."; }
    };

    function validateField(input) {
      var rule = rules[input.name];
      if (!rule) return true;
      var res = rule(input.value);
      var field = input.closest(".field");
      var err = field.querySelector(".field-error");
      var ok = res === true;
      field.classList.toggle("has-error", !ok);
      input.setAttribute("aria-invalid", String(!ok));
      if (err) err.textContent = ok ? "" : res;
      return ok;
    }

    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("blur", function () { if (input.value) validateField(input); });
      input.addEventListener("input", function () {
        if (input.closest(".field") && input.closest(".field").classList.contains("has-error")) validateField(input);
      });
    });

    function showStatus(type, msg) {
      statusEl.className = "form-status is-" + type;
      statusEl.textContent = msg;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (name) {
        var input = form.elements[name];
        if (input && !validateField(input) && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }
      if (form.elements["company_website"] && form.elements["company_website"].value) return; // honeypot

      var data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        interest: form.elements.interest.value,
        message: form.elements.message.value.trim()
      };

      // No endpoint configured: open the visitor's email app instead
      if (!cfg.FORM_ENDPOINT) {
        var body = "Name: " + data.name + "\nEmail: " + data.email + (data.phone ? "\nPhone: " + data.phone : "") +
          "\nInterest: " + data.interest + "\n\n" + data.message;
        window.location.href = "mailto:" + (cfg.EMAIL || "karmyxbusiness@gmail.com") +
          "?subject=" + encodeURIComponent("Website enquiry: " + data.interest) + "&body=" + encodeURIComponent(body);
        showStatus("success", "Your email app should open with your message ready to send. If it doesn't, write to us at " + (cfg.EMAIL || "karmyxbusiness@gmail.com") + ".");
        return;
      }

      submitBtn.disabled = true;
      var label = submitBtn.querySelector("span");
      var original = label.textContent;
      label.textContent = "Sending…";
      fetch(cfg.FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        showStatus("success", "Thank you, " + data.name.split(" ")[0] + "! Your message is with us. We usually reply within 1–2 working days.");
      }).catch(function () {
        showStatus("error", "Sorry, something went wrong while sending. Please try again, or email us at " + (cfg.EMAIL || "karmyxbusiness@gmail.com") + ".");
      }).finally(function () {
        submitBtn.disabled = false;
        label.textContent = original;
      });
    });
  }
})();
