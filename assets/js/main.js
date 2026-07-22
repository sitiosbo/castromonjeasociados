(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // Año dinámico en el footer
    var yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Placeholders listos para conectar GA4 / Meta Pixel cuando los tengas
    // window.gtag && gtag('event', 'page_view');

    /* ---------- Modal de Abogados ---------- */
    var lawyersData = {
      "socio-fundador": {
        nombre: "Dr. Ricardo Monje Valencia",
        cargo: "Socio Fundador",
        especialidad: "Derecho Corporativo y Civil",
        bio: "Con más de 18 años de experiencia en el ámbito corporativo y civil boliviano, el Dr. Monje ha liderado exitosamente fusiones y adquisiciones, arbitrajes internacionales y asesoría regulatoria para empresas nacionales y multinacionales. Es Magíster en Derecho Empresarial por la Universidad Católica Boliviana y cuenta con estudios complementarios en Arbitraje Comercial Internacional. Su enfoque combina una visión estratégica de negocios con un profundo conocimiento del ordenamiento jurídico boliviano, garantizando a sus clientes soluciones legales innovadoras y efectivas.",
        whatsappTexto: "Hola, quisiera agendar una consulta con el Dr. Ricardo Monje, Socio Fundador de Castro & Monje, especialista en Derecho Corporativo y Civil."
      },
      "socia-principal": {
        nombre: "Dra. Carolina Castro Rivas",
        cargo: "Socia Principal",
        especialidad: "Litigio Penal y Derecho de Familia",
        bio: "Con 14 años de trayectoria ininterrumpida en los tribunales paceños, la Dra. Castro se ha consolidado como una de las litigantes más respetadas en las áreas penal y familiar. Ha representado a sus clientes en juicios orales de alto perfil, procesos de mediación familiar, pensiones alimenticias y guardas legales. Es Magíster en Ciencias Penales por la Universidad Mayor de San Andrés y ha participado como ponente en congresos nacionales sobre reforma procesal penal. Su compromiso con la confidencialidad y la defensa firme de los derechos de sus clientes son su sello distintivo.",
        whatsappTexto: "Hola, quisiera agendar una consulta con la Dra. Carolina Castro, Socia Principal de Castro & Monje, especialista en Litigio Penal y Derecho de Familia."
      }
    };

    var modal = document.getElementById("lawyer-modal");
    if (!modal) return;

    var overlay = modal.querySelector(".lawyer-modal__overlay");
    var closeBtn = modal.querySelector(".lawyer-modal__close");
    var container = modal.querySelector(".lawyer-modal__container");
    var photoEl = modal.querySelector(".lawyer-modal__photo");
    var nameEl = modal.querySelector(".lawyer-modal__name");
    var roleEl = modal.querySelector(".lawyer-modal__role");
    var specialtyEl = modal.querySelector(".lawyer-modal__specialty");
    var bioEl = modal.querySelector(".lawyer-modal__bio");
    var whatsappEl = modal.querySelector(".lawyer-modal__whatsapp");
    var lastFocusedCard = null;

    function openLawyerModal(lawyerId) {
      var data = lawyersData[lawyerId];
      if (!data) return;

      var card = document.querySelector('#equipo .card[data-lawyer-id="' + lawyerId + '"]');
      var cardImg = card ? card.querySelector(".team-photo") : null;

      if (cardImg) {
        photoEl.src = cardImg.src;
        photoEl.srcset = cardImg.srcset;
        photoEl.sizes = cardImg.sizes;
        photoEl.alt = cardImg.alt;
        photoEl.loading = cardImg.loading;
        photoEl.decoding = cardImg.decoding;
      }

      nameEl.textContent = data.nombre;
      roleEl.textContent = data.cargo;
      specialtyEl.textContent = data.especialidad;
      bioEl.textContent = data.bio;
      whatsappEl.href = "https://wa.me/59170557088?text=" + encodeURIComponent(data.whatsappTexto);

      lastFocusedCard = card;
      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function closeLawyerModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocusedCard) {
        lastFocusedCard.focus();
        lastFocusedCard = null;
      }
    }

    // Click en cada card de abogado
    document.querySelectorAll("#equipo .card").forEach(function (card) {
      card.addEventListener("click", function (e) {
        var lawyerId = this.getAttribute("data-lawyer-id");
        if (lawyerId) openLawyerModal(lawyerId);
      });
    });

    // Click en overlay para cerrar
    if (overlay) {
      overlay.addEventListener("click", closeLawyerModal);
    }

    // Click en botón cerrar
    if (closeBtn) {
      closeBtn.addEventListener("click", closeLawyerModal);
    }

    // Prevenir cierre al hacer click dentro del contenedor del modal
    if (container) {
      container.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    // Tecla Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeLawyerModal();
      }
    });
  });
})();
