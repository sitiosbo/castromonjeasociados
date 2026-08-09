(function () {
  // ---- Lazy-load de fondos parallax (bg + mid) ----
  // Siempre activo, incluso en móvil
  var bgLayers = document.querySelectorAll("[data-bg], [data-mid]");
  var bgObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var url = el.dataset.bg || el.dataset.mid;
          el.style.backgroundImage = 'url("' + url + '")';
          el.classList.add("is-loaded");
          bgObserver.unobserve(el);
        }
      });
    },
    { rootMargin: "200px 0px" },
  );
  bgLayers.forEach(function (el) {
    bgObserver.observe(el);
  });

  // ---- Parallax de 3 capas con slow-motion (lerp) ----
  // Solo en desktop (>767px). Se desactiva en móvil vía matchMedia.
  var parallaxEls = document.querySelectorAll("[data-speed]");
  var targetY = window.scrollY;
  var currentY = window.scrollY;
  var rafId = null;
  var scrollHandler = null;

  function resetTransforms() {
    parallaxEls.forEach(function (el) {
      el.style.transform = "none";
    });
  }

  function animateParallax() {
    currentY += (targetY - currentY) * 0.08;
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.dataset.speed) || 0.2;
      el.style.transform = "translate3d(0," + currentY * speed + "px,0)";
    });
    rafId = requestAnimationFrame(animateParallax);
  }

  function startParallax() {
    if (rafId) return;
    targetY = window.scrollY;
    currentY = window.scrollY;
    scrollHandler = function () {
      targetY = window.scrollY;
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });
    animateParallax();
  }

  function stopParallax() {
    if (scrollHandler) {
      window.removeEventListener("scroll", scrollHandler);
      scrollHandler = null;
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    resetTransforms();
  }

  var mql = window.matchMedia("(max-width: 767px)");

  function handleViewportChange(e) {
    if (e.matches) {
      stopParallax();
    } else {
      startParallax();
    }
  }

  mql.addEventListener("change", handleViewportChange);
  handleViewportChange(mql);
})();
