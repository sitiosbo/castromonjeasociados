(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var hamburger = document.querySelector(".hamburger");
    var navMenu = document.querySelector(".nav-menu");
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", isOpen);
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  });
})();
