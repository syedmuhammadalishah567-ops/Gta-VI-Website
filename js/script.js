(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", function () {
    var open = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".world-card, .duo-card, .duo-banner, .cast-card, .edition-card, .gallery-grid img, .time-box"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach(function (el) { io.observe(el); });

  /* ---------- Countdown ---------- */
  // Rockstar Games' publicly announced launch date for Grand Theft Auto VI.
  // Verify the current official date at https://www.rockstargames.com/VI
  var TARGET_DATE = new Date("2026-11-19T05:00:00Z"); // Nov 19, 2026 — 12:00 AM ET

  var elDays = document.getElementById("cd-days");
  var elHours = document.getElementById("cd-hours");
  var elMins = document.getElementById("cd-mins");
  var elSecs = document.getElementById("cd-secs");
  var countdownWrap = document.getElementById("countdownWrap");
  var releaseBanner = document.getElementById("releaseBanner");
  var confettiHost = document.getElementById("confetti");

  var lastValues = { d: null, h: null, m: null, s: null };
  var celebrated = false;

  function pad(n) { return String(n).padStart(2, "0"); }

  function pulse(el, value) {
    el.textContent = pad(value);
  }

  function tick() {
    var now = new Date().getTime();
    var diff = TARGET_DATE.getTime() - now;

    if (diff <= 0) {
      if (!celebrated) {
        celebrated = true;
        countdownWrap.hidden = true;
        releaseBanner.hidden = false;
        launchConfetti();
      }
      return;
    }

    var d = Math.floor(diff / (1000 * 60 * 60 * 24));
    var h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var m = Math.floor((diff / (1000 * 60)) % 60);
    var s = Math.floor((diff / 1000) % 60);

    if (d !== lastValues.d) { pulse(elDays, d); lastValues.d = d; }
    if (h !== lastValues.h) { pulse(elHours, h); lastValues.h = h; }
    if (m !== lastValues.m) { pulse(elMins, m); lastValues.m = m; }
    if (s !== lastValues.s) { pulse(elSecs, s); lastValues.s = s; }
  }

  tick();
  setInterval(tick, 1000);

  /* ---------- Confetti burst on release ---------- */
  function launchConfetti() {
    if (!confettiHost) return;
    var emojis = ["🎉", "🔥", "🌴", "🚗", "💸", "🎮", "✨"];
    for (var i = 0; i < 60; i++) {
      (function () {
        var span = document.createElement("span");
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = Math.random() * 100 + "%";
        span.style.animationDuration = 2.5 + Math.random() * 2 + "s";
        span.style.animationDelay = Math.random() * 1.2 + "s";
        span.style.fontSize = 14 + Math.random() * 16 + "px";
        confettiHost.appendChild(span);
      })();
    }
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");
  var lightboxCounter = document.getElementById("lightboxCounter");
  var galleryGrid = document.getElementById("galleryGrid");
  var galleryImages = galleryGrid ? Array.prototype.slice.call(galleryGrid.querySelectorAll("img")) : [];
  var currentIndex = 0;

  function showImage(index) {
    if (!galleryImages.length) return;
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    var img = galleryImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCounter.textContent = (currentIndex + 1) + " / " + galleryImages.length;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  galleryImages.forEach(function (img, index) {
    img.addEventListener("click", function () {
      openLightbox(index);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", function (e) {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener("click", function (e) {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });
  }
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  });
})();
