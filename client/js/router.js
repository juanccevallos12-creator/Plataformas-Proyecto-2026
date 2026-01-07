// /client/js/router.js

import { HomeView, initHome } from "./views/home.js";
import { ProductosView, initProductos } from "./views/productos.js";
import { ProductoDetalleView, initProductoDetalle } from "./views/productoDetalle.js";
import { CarritoView, initCarrito } from "./views/carrito.js";
import { CheckoutView, initCheckoutView } from "./views/checkout.js"; // ← AGREGAR
import { ContactoView, initContacto } from "./views/contacto.js";
import { LoginView, initLogin } from "./views/login.js";
import { AdminView, initAdmin } from "./views/admin.js";
import { PerfilView, initPerfil } from "./views/perfil.js";
import { PedidosView, initPedidos } from "./views/pedidos.js";
import { NosotrosView } from "./views/nosotros.js";
import { EnviosView } from "./views/envios.js";

const routes = {
  "/":              { view: HomeView, init: initHome },
  "/productos":     { view: ProductosView, init: initProductos },
  "/producto":      { view: ProductoDetalleView, init: initProductoDetalle },
  "/carrito":       { view: CarritoView, init: initCarrito },
  "/checkout": { view: CheckoutView, init: initCheckoutView },
  "/contacto":      { view: ContactoView, init: initContacto },
  "/login":         { view: LoginView, init: initLogin },
  "/admin":         { view: AdminView, init: initAdmin },
  "/perfil":        { view: PerfilView, init: initPerfil },
  "/pedidos":       { view: PedidosView, init: initPedidos },
  "/nosotros":      { view: NosotrosView },
  "/envios":        { view: EnviosView }
};

export function router() {
  const app = document.getElementById("app");
  let hash = location.hash.slice(1) || "/";
  const parts = hash.split("/").filter(x => x);
  const base = "/" + (parts[0] || "");
  const param = parts[1] || null;

  const route = routes[base];

  if (!route) {
    app.innerHTML = `
      <div class="container" style="text-align:center; padding:4rem 2rem;">
        <h2 style="font-size:3rem; margin-bottom:1rem;">404</h2>
        <p style="color:var(--text-muted); margin-bottom:2rem;">
          Página no encontrada
        </p>
        <a href="#/" class="btn btn-primary">← Volver al inicio</a>
      </div>
    `;
    return;
  }

  app.innerHTML = route.view(param);

  requestAnimationFrame(() => {
    if (typeof route.init === "function") {
      route.init(param);
    }
  });
}