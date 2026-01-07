// /client/js/logic/carritoLogic.js

import { 
  leerCart, 
  quitarDelCarrito, 
  vaciarCarrito,
  cambiarCantidad,
  actualizarCantidad,
  calcularTotal
} from "../state/cart.js";
import { getProductos } from "../api/productos.js";
import { crearPedido } from "../api/pedidos.js";
import { $, fmtUSD, showToast } from "../utils.js";

// ============================================================
//              DEBOUNCING PARA EVITAR SPAM
// ============================================================

let debounceTimer = null;

function debounce(func, delay = 300) {
  return function(...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
}

// ============================================================
//                  ACTUALIZAR UI SIN RE-RENDER
// ============================================================

function actualizarFilaCarrito(id, productos) {
  console.log('🔄 Actualizando fila:', id); // DEBUG
  
  const cart = leerCart();
  const item = cart.find(x => x.id === id);
  if(!item) {
    console.error('❌ Item no encontrado en cart:', id);
    return;
  }

  const producto = productos.find(p => p.id === id);
  if(!producto) {
    console.error('❌ Producto no encontrado:', id);
    return;
  }

  const precio = producto.precio;
  const subtotal = precio * item.qty;

  console.log('💰 Nueva cantidad:', item.qty, 'Subtotal:', subtotal); // DEBUG

  // Actualizar cantidad en el input
  const input = document.querySelector(`.input-qty[data-id="${id}"]`);
  console.log('🔍 Input encontrado:', input); // DEBUG
  
  if(input) {
    input.value = item.qty;
    console.log('✅ Input actualizado a:', input.value); // DEBUG
  } else {
    console.error('❌ Input no encontrado para id:', id);
  }

  // Actualizar subtotal de la fila
  const row = input?.closest("tr");
  console.log('📋 Fila encontrada:', row); // DEBUG
  
  if (row) {
    const subtotalCell = row.querySelector(".cart-subtotal");
    console.log('💵 Celda subtotal encontrada:', subtotalCell); // DEBUG
    
    if (subtotalCell) {
      subtotalCell.textContent = fmtUSD(subtotal);
      console.log('✅ Subtotal actualizado a:', subtotalCell.textContent); // DEBUG
    } else {
      console.error('❌ Celda subtotal no encontrada');
    }
  } else {
    console.error('❌ Fila no encontrada');
  }

  // Actualizar total general
  actualizarTotalGeneral(productos);
}

function actualizarTotalGeneral(productos) {
  console.log('💰 Actualizando total general'); // DEBUG
  
  const total = calcularTotal(productos);
  console.log('💵 Total calculado:', total); // DEBUG
  
  const totalEl = document.querySelector(".cart-total");
  console.log('🔍 Elemento total encontrado:', totalEl); // DEBUG
  
  if(totalEl) {
    totalEl.textContent = fmtUSD(total);
    console.log('✅ Total actualizado a:', totalEl.textContent); // DEBUG
  } else {
    console.error('❌ Elemento .cart-total no encontrado');
  }
}

// ============================================================
//                    RENDER DEL CARRITO
// ============================================================

export async function renderCarrito() {
  const host = $("#carrito-vista");
  if (!host) return;

  host.innerHTML = "<p>Cargando carrito…</p>";

  // Cargar productos
  const productos = await getProductos().catch(() => []);
  const index = Object.fromEntries(productos.map(p => [p.id, p]));

  const cart = leerCart();

  // Carrito vacío
  if (cart.length === 0) {
    host.innerHTML = `
      <div class="cart-empty">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🛒</div>
        <h2>Tu carrito está vacío</h2>
        <p style="color: var(--text-muted); margin: 1rem 0 2rem;">
          Agrega productos para comenzar tu compra
        </p>
        <a class="btn btn-primary" href="#/productos">Ver productos</a>
      </div>
    `;
    return;
  }

  // Render de filas
  const filas = cart.map(item => {
    const prod = index[item.id];
    const nombre = prod?.nombre || `Producto ${item.id}`;
    const precio = prod?.precio ?? item.precio ?? 0;
    const subtotal = precio * item.qty;
    
    // Normalizar ruta de imagen
    let imagen = prod?.imagen || "./assets/images/placeholder.jpg";
    if(imagen.startsWith("./")) {
      imagen = imagen.replace("./", "/");
    }

    return `
      <tr data-product-id="${item.id}">
        <td>
          <div class="cart-item">
            <img src="${imagen}" 
                 alt="${nombre}" 
                 class="cart-thumb"
                 onerror="this.src='/assets/images/placeholder.jpg'">
            <strong>${nombre}</strong>
          </div>
        </td>

        <td>
          <div class="cart-qty">
            <button class="btn-qty" data-id="${item.id}" data-change="-1" aria-label="Disminuir cantidad">
              −
            </button>
            <input 
              type="number" 
              min="1" 
              max="999"
              step="1" 
              class="input-qty" 
              data-id="${item.id}" 
              value="${item.qty}"
              aria-label="Cantidad">
            <button class="btn-qty" data-id="${item.id}" data-change="1" aria-label="Aumentar cantidad">
              +
            </button>
          </div>
        </td>

        <td class="cart-price">${fmtUSD(precio)}</td>
        <td class="cart-subtotal">${fmtUSD(subtotal)}</td>

        <td>
          <button class="btn-del" data-id="${item.id}" aria-label="Eliminar producto">
            🗑️
          </button>
        </td>
      </tr>
    `;
  }).join("");

  const total = calcularTotal(productos);

  // Render final
  host.innerHTML = `
    <div class="cart-container">
      <div class="cart-card">
        <div class="cart-table-wrapper">
          <table class="cart-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </div>

        <div class="cart-footer">
          <div class="cart-total-wrapper">
            <span class="cart-total-label">Total:</span>
            <span class="cart-total">${fmtUSD(total)}</span>
          </div>

          <div class="cart-actions">
            <button class="btn btn-secondary" id="vaciar">
              🗑️ Vaciar carrito
            </button>
            <button class="btn btn-primary" id="continuar">
              ✓ Finalizar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // ============================================================
  //                     EVENTOS DEL CARRITO
  // ============================================================

  // Botones +/- (con debouncing para evitar spam)
  host.addEventListener("click", e => {
    const btn = e.target.closest(".btn-qty");
    if (!btn) return;

    e.preventDefault();
    
    const id = btn.dataset.id;
    const delta = parseInt(btn.dataset.change);

    // Deshabilitar temporalmente
    btn.disabled = true;
    
    const nuevaCantidad = cambiarCantidad(id, delta);
    
    if(nuevaCantidad !== null) {
      actualizarFilaCarrito(id, productos);
    }

    // Re-habilitar después de 200ms
    setTimeout(() => btn.disabled = false, 200);
  });

  // Input manual (con debouncing)
  const debouncedUpdate = debounce((id, valor) => {
    const nuevaCantidad = actualizarCantidad(id, valor);
    if(nuevaCantidad !== null) {
      actualizarFilaCarrito(id, productos);
    }
  }, 500);

  host.addEventListener("input", e => {
    const inp = e.target.closest(".input-qty");
    if (!inp) return;

    const id = inp.dataset.id;
    const valor = inp.value;

    debouncedUpdate(id, valor);
  });

  // Botón eliminar
  host.addEventListener("click", e => {
    const del = e.target.closest(".btn-del");
    if (!del) return;

    const id = del.dataset.id;
    const producto = index[id];
    
    if(confirm(`¿Eliminar ${producto?.nombre || 'este producto'} del carrito?`)) {
      quitarDelCarrito(id);
      renderCarrito();
    }
  });

  // Vaciar carrito
  $("#vaciar")?.addEventListener("click", () => {
    if(confirm("¿Estás seguro de vaciar todo el carrito?")) {
      vaciarCarrito();
      renderCarrito();
    }
  });

  // Continuar - CREAR PEDIDO
  $("#continuar")?.addEventListener("click", () => {
  // Redirigir al checkout
  location.hash = "#/checkout";
});
}