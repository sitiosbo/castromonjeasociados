(function () {
  // ---- Lazy-load de fondos parallax (bg + mid) ----
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
  var parallaxEls = document.querySelectorAll("[data-speed]");
  var targetY = window.scrollY;
  var currentY = window.scrollY;

  window.addEventListener(
    "scroll",
    function () {
      targetY = window.scrollY;
    },
    { passive: true },
  );

  function animateParallax() {
    currentY += (targetY - currentY) * 0.08; // factor de "slow motion"
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.dataset.speed) || 0.2;
      el.style.transform = "translate3d(0," + currentY * speed + "px,0)";
    });
    requestAnimationFrame(animateParallax);
  }
  requestAnimationFrame(animateParallax);
})();
