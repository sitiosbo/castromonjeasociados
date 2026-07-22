(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var revealEls = document.querySelectorAll(".reveal");
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  });
})();
