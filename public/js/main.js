/* Brandt's of Palatine — small progressive-enhancement helpers. */
(function () {
  "use strict";

  // Footer year
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Dropdowns: hover works via CSS; on touch/click toggle the .open class.
  document.querySelectorAll(".has-dropdown > a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      // On small screens, first tap opens the submenu instead of navigating.
      if (window.matchMedia("(max-width: 860px)").matches) {
        var li = link.parentElement;
        if (!li.classList.contains("open")) {
          e.preventDefault();
          li.classList.add("open");
        }
      }
    });
  });

  // Rotating gallery / carousel
  document.querySelectorAll("[data-carousel]").forEach(function (car) {
    var slides = car.querySelectorAll(".carousel-slide");
    var dots = car.querySelectorAll(".carousel-dot");
    if (slides.length <= 1) {
      car.classList.add("is-single");
      return;
    }
    var idx = 0;
    var timer = null;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("is-active", k === idx); });
      dots.forEach(function (d, k) { d.classList.toggle("is-active", k === idx); });
    }
    function start() { if (reduce) return; stop(); timer = setInterval(function () { show(idx + 1); }, 5000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    var next = car.querySelector(".carousel-arrow.next");
    var prev = car.querySelector(".carousel-arrow.prev");
    if (next) next.addEventListener("click", function () { show(idx + 1); start(); });
    if (prev) prev.addEventListener("click", function () { show(idx - 1); start(); });
    dots.forEach(function (d, k) { d.addEventListener("click", function () { show(k); start(); }); });

    car.addEventListener("mouseenter", stop);
    car.addEventListener("mouseleave", start);
    car.addEventListener("focusin", stop);
    car.addEventListener("focusout", start);
    start();
  });

  // Contact form: if no Formspree action is set, fall back to a mailto: that
  // opens the user's mail client pre-filled. If Formspree IS set, submit via
  // fetch so the visitor stays on the page.
  var form = document.getElementById("contactForm");
  if (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      var hasAction = form.getAttribute("action");
      var name = (form.name.value || "").trim();
      var email = (form.email.value || "").trim();
      var phone = (form.phone.value || "").trim();
      var message = (form.message.value || "").trim();

      if (!hasAction) {
        // mailto fallback
        e.preventDefault();
        var to = form.getAttribute("data-email");
        var subject = "Website message from " + (name || "a visitor");
        var bodyLines = [
          "Name: " + name,
          "Email: " + email,
          phone ? "Phone: " + phone : "",
          "",
          message,
        ].filter(Boolean);
        window.location.href =
          "mailto:" + to +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(bodyLines.join("\n"));
        if (status) {
          status.textContent =
            "Opening your email app… if nothing happens, email us at " + to + ".";
          status.className = "form-status ok";
        }
        return;
      }

      // Formspree AJAX submit
      e.preventDefault();
      if (status) { status.textContent = "Sending…"; status.className = "form-status"; }
      fetch(hasAction, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (status) { status.textContent = "Thanks! Your message has been sent."; status.className = "form-status ok"; }
          } else {
            throw new Error("bad response");
          }
        })
        .catch(function () {
          if (status) {
            status.textContent =
              "Sorry, something went wrong. Please email us directly at " +
              form.getAttribute("data-email") + ".";
            status.className = "form-status err";
          }
        });
    });
  }
})();
