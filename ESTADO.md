# ESTADO.md — Migración Astro Castro & Monje

## Objetivo del proyecto
One-page en Astro, mobile-first, manteniendo secciones y anclas del sitio original.

## Etapas completadas
- [x] Etapa 0: Andamiaje
- [x] Etapa 1: Layout base + variables CSS
- [x] Etapa 2: Navbar + Footer + WhatsAppFloat
- [x] Etapa 3: Hero (carrusel + texto dinámico + parallax)
- [x] Etapa 3-fix: scroll-reveal.js global
- [x] Etapa 4: TrustBadges + About
- [x] Etapa 5: PracticeAreas + Process (datos en .js, renderizados con .map())
- [x] Etapa 6: Team + LawyerModal (datos vía JSON script tag, main.js ajustado)
- [x] Etapa 7: Testimonials + FAQ (FAQPage JSON-LD ahora es dinámico desde faq.js)
- [x] Etapa 8: Contact (iframe OpenStreetMap tal cual, coordenadas exactas)
- [x] Etapa 9: Imágenes migradas de Unsplash a src/assets/images/ (WebP optimizado)
- [x] Etapa 10: Parallax desactivado en móvil (<768px) vía matchMedia + QA completo

## Etapa actual
**MIGRACIÓN COMPLETA** — Proyecto listo para producción

## Decisiones tomadas
- CSS: `global.css` importa `variables.css`, `components.css`, `sections.css`, `animations.css` (todos sin modificar).
- `BaseLayout.astro` importa `global.css` vía frontmatter (Astro lo bundea automáticamente).
- JSON-LD LegalService y FAQPage replicados tal cual del index.html original.
- Google Fonts (Inter + Playfair Display) cargados vía <link> externo.
- `components.css` copiado a `src/styles/` e importado en `global.css`.
- `mobile-menu.js` copiado a `src/scripts/`, importado dentro de `Navbar.astro`.
- `Footer.astro` calcula el año dinámico con `new Date().getFullYear()`.
- **Hero**: `dynamic-text.js` y `parallax.js` inyectados con `<script is:inline>` en `Hero.astro`.
- **Reveal**: `--duration-slow` ajustado de `420ms` a `900ms` para transición más visible.
- **Datos**: PracticeAreas y Process usan arrays en `src/data/` renderizados con `.map()`, no HTML copiado.
- **LawyerModal**: `lawyersData` se pasa del build-time al cliente vía `<script type="application/json" id="lawyers-data">` con `set:html={JSON.stringify(lawyersData)}` para evitar escaping HTML. Verificado: `&quot;` y `&amp;` no presentes, `JSON.parse` exitoso.
- **main.js**: copiado a `public/scripts/main.js` (servido como asset estático), referenciado con `<script is:inline src="/scripts/main.js">` en `BaseLayout.astro`.
- **FAQPage JSON-LD**: ahora se genera dinámicamente a partir de `src/data/faq.js` (misma fuente que usa `FAQ.astro`). Una sola fuente de verdad, imposible que se desincronice.
- **Testimonios**: HTML directo en `Testimonials.astro` (1 solo testimonio, no justifica array).

## Decisiones Etapa 10 (parallax móvil)
- **Opción elegida**: Desactivar loop de rAF + parallax en móvil (<768px) vía `matchMedia`.
- **Mecanismo**: `matchMedia("(max-width: 767px)")` con `addEventListener("change", ...)` para soportar resize/rotación en vivo.
- **Lazy-load de fondos**: Se mantiene SIEMPRE activo (IntersectionObserver separado).
- **Reset de transforms**: `stopParallax()` ejecuta `el.style.transform = "none"` en todos los `[data-speed]`, no deja `translate3d(0,0,0)`.
- **Desktop**: Efecto idéntico al anterior (sin cambios).

## ⚠️ LECCIÓN APRENDIDA: scroll-reveal.js
**`scroll-reveal.js` debe vivir en `BaseLayout.astro`, no en componentes de sección individuales.**
- Razón: observa TODOS los `.reveal` de la página (hero, about, areas, equipo, etc.).
- Si se pone en un componente, solo observa los `.reveal` de ese componente.
- Se inyecta con `<script is:inline>` (no como módulo ES) porque usa `DOMContentLoaded`.

## ⚠️ LECCIÓN APRENDIDA: <Image /> de astro:assets no funciona con rutas de public/
**Causa raíz:** `<Image src="/assets/images/foo.jpg" />` lanza `ReferenceError: Image is not defined` durante el build. `<Image>` solo acepta imports locales de `src/` o URLs remotas autorizadas.
**Solución definitiva:** Mover imágenes de `public/assets/images/` a `src/assets/images/`, importarlas en los componentes, y usar `<Image src={importedImage} />`. Conversión a WebP automática.

## ⚠️ LECCIÓN APRENDIDA: JSON-LD desincronizado
**Causa raíz:** El JSON-LD FAQPage estaba hardcodeado en `BaseLayout.astro` como texto estático separado del contenido real en el HTML. Cuando se migró el HTML del faq a componentes Astro, las respuestas se copiaron más completas pero el JSON-LD no se actualizó → desincronización.
**Solución:** Generar el JSON-LD dinámicamente a partir del mismo array de `src/data/faq.js` que usa `FAQ.astro`. Una sola fuente de verdad. Verificación de coincidencia carácter por carácter incluida.

## ⚠️ NOTA CRÍTICA: Hero
**El hero depende de `dynamic-text.js` y `parallax.js`. No tocar sin revisar ambos archivos.**
- Los scripts se inyectan con `<script is:inline>` (no como módulos ES) porque usan `DOMContentLoaded` que ya disparó cuando un módulo diferido se ejecuta.
- `dynamic-text.js` usa: `.dynamic-text`, `#hero-description`, `.hero-carousel`, `.hero-carousel-mid`, `.hero-slide`, `.is-active`, `data-words`, `data-descriptions`, `data-src`.
- `parallax.js` usa: `[data-bg]`, `[data-mid]`, `[data-speed]`, `.is-loaded`.
- CSS en `sections.css` define: `.hero-carousel`, `.hero-carousel-mid`, `.hero-slide`, `.hero-slide.is-active`.
- CSS en `animations.css` define: `.dynamic-text`, `.dynamic-text.is-fading`, `.hero-slide` (transition).

## Archivos creados en Etapa 1
- `src/styles/variables.css` — copia exacta de `assets/css/variables.css`
- `src/styles/global.css` — imports de variables + base + components + sections + animations
- `src/layouts/BaseLayout.astro` — layout con <head> completo del sitio original

## Archivos creados en Etapa 2
- `src/styles/components.css` — copia exacta de `assets/css/components.css`
- `src/scripts/mobile-menu.js` — copia exacta de `assets/js/mobile-menu.js`
- `src/components/Navbar.astro` — menú de navegación + hamburger + script
- `src/components/WhatsAppFloat.astro` — botón flotante de WhatsApp
- `src/components/Footer.astro` — pie de página con año dinámico

## Archivos creados en Etapa 3
- `src/styles/sections.css` — copia exacta de `assets/css/sections.css`
- `src/styles/animations.css` — copia exacta de `assets/css/animations.css`
- `src/scripts/dynamic-text.js` — copia exacta de `assets/js/dynamic-text.js`
- `src/scripts/parallax.js` — copia exacta de `assets/js/parallax.js`
- `src/scripts/scroll-reveal.js` — copia exacta de `assets/js/scroll-reveal.js`
- `src/components/Hero.astro` — carrusel bg + mid + texto dinámico + parallax

## Archivos creados en Etapa 4
- `src/components/TrustBadges.astro` — badges de confianza con SVG inline
- `src/components/About.astro` — sección "Sobre el despacho" con parallax + imagen
- `src/pages/index.astro` — actualizado con imports de TrustBadges y About

## Archivos creados en Etapa 5
- `src/data/practiceAreas.js` — array de 6 objetos { title, description, whatsappText, linkText, svgIcon }
- `src/data/processSteps.js` — array de 4 objetos { number, title, description }
- `src/components/PracticeAreas.astro` — sección #areas, itera practiceAreas con .map()
- `src/components/Process.astro` — sección #proceso, itera processSteps con .map()

## Archivos creados en Etapa 6
- `src/data/lawyers.js` — objeto lawyersData con 2 abogados (socio-fundador, socia-principal)
- `src/components/Team.astro` — sección #equipo, parallax + 2 cards con `data-lawyer-id`
- `src/components/LawyerModal.astro` — modal + `<script is:inline type="application/json" id="lawyers-data">` con `set:html={JSON.stringify(lawyersData)}`
- `src/scripts/main.js` — main.js ajustado: `lawyersData` leído de `JSON.parse(document.getElementById('lawyers-data').textContent)` en vez de hardcoded
- `public/scripts/main.js` — copia servida como asset estático

## Archivos creados en Etapa 7
- `src/data/faq.js` — array de 3 objetos { question, answer } — fuente de verdad para FAQ.astro Y JSON-LD FAQPage
- `src/components/Testimonials.astro` — sección #testimonios, HTML directo (1 testimonio)
- `src/components/FAQ.astro` — sección #faq, itera faqItems con .map()
- `src/scripts/faq-accordion.js` — copia exacta de `assets/js/faq-accordion.js`
- `public/scripts/faq-accordion.js` — copia servida como asset estático
- `BaseLayout.astro` — JSON-LD FAQPage ahora se genera dinámicamente desde `faqItems` (eliminado hardcode)

## Archivos creados en Etapa 8
- `src/components/Contact.astro` — sección #contacto, iframe OpenStreetMap con coordenadas y bbox exactos del original

## Archivos creados en Etapa 9
- `src/assets/images/about-office.jpg` — imagen About (original 98KB, WebP 66KB)
- `src/assets/images/lawyer-ricardo.jpg` — imagen Dr. Monje (original 81KB, WebP 41KB)
- `src/assets/images/lawyer-carolina.jpg` — imagen Dra. Castro (original 125KB, WebP 57KB)
- `src/components/About.astro` — actualizado: `<Image src={aboutOffice} />` con import local
- `src/components/Team.astro` — actualizado: `<Image src={lawyerRicardo/lawyerCarolina} />` con imports locales

## Archivos modificados en Etapa 10
- `src/components/Hero.astro` — script inline de parallax actualizado con matchMedia toggle
- `src/scripts/parallax.js` — copia actualizada (no se usa directamente, el código está inline en Hero.astro)

## QA Checklist — Etapa 10
- [x] `npm run build` sin errores ni warnings
- [x] Anclas navbar: `#nosotros`, `#areas`, `#equipo`, `#faq`, `#contacto` — todas presentes
- [x] Menú hamburguesa: script mobile-menu.js presente, botón hamburger con aria-label
- [x] Modal abogados: `lawyer-modal` presente, 2 `data-lawyer-id`, script main.js con open/close/Escape
- [x] FAQ acordeón: 3 `faq-item`, 3 `faq-question`, 3 `faq-icon`, script faq-accordion.js
- [x] Hero: `dynamic-text`, `hero-description`, 14 `hero-slide`, script dynamic-text.js
- [x] JSON-LD: 2 bloques `application/ld+json` (LegalService + FAQPage)
- [x] Parallax: `matchMedia("(max-width: 767px)")` + `cancelAnimationFrame` presente
- [x] Scroll-reveal: 26 elementos `.reveal` detectados

## Pendiente
Lighthouse — ver instrucciones más abajo

## Notas para el agente
Lee este archivo completo antes de escribir código. No asumas nada que no esté aquí.
