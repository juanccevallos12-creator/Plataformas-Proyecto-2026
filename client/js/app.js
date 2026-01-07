// /client/js/app.js

import { router } from "./router.js";
import { cargarHeader } from "./components/header.js";
import { cargarFooter } from "./components/footer.js";
import { pintarBadge } from "./state/cart.js";
import { pintarSesion } from "./state/session.js";

/* ============================================
               INICIALIZACIÓN SPA
=============================================== */

document.addEventListener("DOMContentLoaded", () => {

  // Cargar header y footer
  cargarHeader();
  cargarFooter();

  // Pintar estado inicial del carrito y usuario
  pintarBadge();
  pintarSesion();

  // Render inicial
  router();
});

// Cuando cambia el hash → cambiar vista
window.addEventListener("hashchange", router);
