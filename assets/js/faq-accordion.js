(function () {
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".faq-question").forEach(function (question) {
      question.addEventListener("click", function () {
        var item = question.closest(".faq-item");
        var wasActive = item.classList.contains("active");

        document.querySelectorAll(".faq-item").forEach(function (i) {
          i.classList.remove("active");
        });

        if (!wasActive) item.classList.add("active");
      });
    });
  });
})();
