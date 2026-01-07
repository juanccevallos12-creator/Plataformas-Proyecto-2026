// /client/js/views/pedidos.js

import { getUser, requireAuth } from "../state/session.js";
import { renderPedidos } from "../logic/pedidosLogic.js";

export function PedidosView() {
  if (!requireAuth()) {
    return `<div class="container"><p>Redirigiendo...</p></div>`;
  }

  return `
    <div class="container">
      <div class="pedidos-wrapper">
        
        <div class="pedidos-header">
          <h1>📦 Mis Pedidos</h1>
          <p>Historial de tus compras realizadas</p>
        </div>

        <div id="pedidos-list"></div>

      </div>
    </div>
  `;
}

export function initPedidos() {
  if (!requireAuth()) return;
  renderPedidos();
}