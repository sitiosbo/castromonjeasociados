(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var textEl = document.querySelector(".dynamic-text");
    var descEl = document.getElementById("hero-description");
    var carouselBg = document.querySelector(".hero-carousel");
    var carouselMid = document.querySelector(".hero-carousel-mid");
    if (!textEl || !carouselBg || !carouselMid) return;

    var words = JSON.parse(textEl.dataset.words || "[]");
    var descriptions = JSON.parse(textEl.dataset.descriptions || "[]");
    if (!words.length) return;

    var bgSlides = carouselBg.querySelectorAll(".hero-slide");
    var midSlides = carouselMid.querySelectorAll(".hero-slide");
    if (!bgSlides.length || !midSlides.length) return;

    var currentSlide = 0;
    var timerId = null;
    var isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function goToSlide(index) {
      bgSlides.forEach(function (s) { s.classList.remove("is-active"); });
      midSlides.forEach(function (s) { s.classList.remove("is-active"); });
      bgSlides[index].classList.add("is-active");
      midSlides[index].classList.add("is-active");
      textEl.textContent = words[index];
      if (descEl && descriptions[index]) descEl.textContent = descriptions[index];
      currentSlide = index;
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % bgSlides.length);
    }

    function startTimer() {
      if (timerId) clearInterval(timerId);
      timerId = setInterval(nextSlide, 5000);
    }

    function stopTimer() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    // Si prefiere reduced motion: solo slide 0, sin ciclo
    if (isReduced) {
      goToSlide(0);
      return;
    }

    // Estado inicial: slide 0 visible
    goToSlide(0);

    // Precargar imágenes diferidas después de que la página haya terminado
    function precargarDiferidos() {
      var bgPending = carouselBg.querySelectorAll(".hero-slide[data-src]");
      bgPending.forEach(function (el) {
        el.style.backgroundImage = 'url("' + el.dataset.src + '")';
        el.removeAttribute("data-src");
      });
      var midPending = carouselMid.querySelectorAll(".hero-slide[data-src]");
      midPending.forEach(function (el) {
        el.style.backgroundImage = 'url("' + el.dataset.src + '")';
        el.removeAttribute("data-src");
      });
    }

    function onPageReady() {
      precargarDiferidos();
      startTimer();
    }

    // Prioridad: requestIdleCallback > window.load + setTimeout
    if (window.requestIdleCallback) {
      window.addEventListener("load", function () {
        requestIdleCallback(onPageReady, { timeout: 3000 });
      });
    } else {
      window.addEventListener("load", function () {
        setTimeout(onPageReady, 1000);
      });
    }

    // Pausar al ocultar pestaña, reanudar al mostrarla
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    });
  });
})();
