// /client/js/logic/pedidosLogic.js

import { obtenerPedidos } from "../api/pedidos.js";
import { getUser } from "../state/session.js";
import { $, fmtUSD } from "../utils.js";

export async function renderPedidos() {
  const container = $("#pedidos-list");
  if (!container) return;

  container.innerHTML = "<p>Cargando pedidos...</p>";

  try {
    const user = getUser();
    const todosPedidos = await obtenerPedidos();
    
    // Filtrar pedidos del usuario actual
    const pedidosUsuario = todosPedidos.filter(p => p.usuarioId === user.id);

    if (pedidosUsuario.length === 0) {
      container.innerHTML = `
        <div class="pedidos-empty">
          <div style="font-size: 4rem; margin-bottom: 1rem;">📦</div>
          <h2>No tienes pedidos aún</h2>
          <p style="color: var(--text-muted); margin: 1rem 0 2rem;">
            Explora nuestro catálogo y realiza tu primera compra
          </p>
          <a href="#/productos" class="btn btn-primary">Ver productos</a>
        </div>
      `;
      return;
    }

    // Ordenar por fecha (más reciente primero)
    pedidosUsuario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    container.innerHTML = `
      <div class="pedidos-grid">
        ${pedidosUsuario.map(renderPedidoCard).join('')}
      </div>
    `;

  } catch (error) {
    console.error("Error cargando pedidos:", error);
    container.innerHTML = `
      <div class="error-message">
        <p>❌ Error al cargar pedidos</p>
        <button class="btn" onclick="location.reload()">Reintentar</button>
      </div>
    `;
  }
}

function renderPedidoCard(pedido) {
  const fecha = new Date(pedido.fecha).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const estadoClass = {
    'pendiente': 'soon',
    'procesando': 'warn',
    'enviado': 'ok',
    'entregado': 'ok',
    'cancelado': 'error'
  }[pedido.estado] || 'soon';

  return `
    <div class="pedido-card">
      <div class="pedido-header">
        <div>
          <h3>Pedido #${pedido.id.slice(-8)}</h3>
          <p class="pedido-fecha">${fecha}</p>
        </div>
        <span class="badge ${estadoClass}">${pedido.estado}</span>
      </div>

      <div class="pedido-items">
        <p><strong>${pedido.items.length}</strong> producto${pedido.items.length !== 1 ? 's' : ''}</p>
        <ul class="pedido-items-list">
          ${pedido.items.slice(0, 3).map(item => `
            <li>• ${item.cantidad}x Producto ID: ${item.productoId}</li>
          `).join('')}
          ${pedido.items.length > 3 ? `<li>• Y ${pedido.items.length - 3} más...</li>` : ''}
        </ul>
      </div>

      <div class="pedido-footer">
        <div class="pedido-total">
          <span>Total:</span>
          <strong>${fmtUSD(pedido.total)}</strong>
        </div>
        <button class="btn btn-sm" onclick="alert('Ver detalles: ${pedido.id}')">
          Ver detalles
        </button>
      </div>
    </div>
  `;
}