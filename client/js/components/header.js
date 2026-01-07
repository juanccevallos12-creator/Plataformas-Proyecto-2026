// /client/js/components/header.js

import { pintarSesion } from "../state/session.js";
import { pintarBadge } from "../state/cart.js";

export function cargarHeader() {
  const header = document.querySelector("header#header");
  if (!header) return;

  header.innerHTML = `
    <div class="container nav">

      <a href="#/" class="brand">
        <span class="dot"></span> New Era Tech
      </a>

      <button class="burger" id="burger-btn" aria-label="Abrir menú">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="menu" id="main-menu">
        <a href="#/">Inicio</a>
        <a href="#/productos">Productos</a>
        <a href="#/contacto">Contacto</a>
        <a href="#/carrito" id="cart-link" class="badge-cart">🛒 Carrito (0)</a>
        <span id="user-zone"></span>
      </nav>
    </div>
  `;

  activarBurger();
  pintarBadge();
  pintarSesion();
}

function activarBurger() {
  const burger = document.getElementById("burger-btn");
  const menu = document.getElementById("main-menu");

  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    menu.classList.toggle("show");
  });
}

