// /client/js/state/cart.js

import { fmtUSD, showToast } from "../utils.js";
import { $ } from "../utils.js";

const LS_CART = "net_cart_v1";

// ============================================================
//                 FUNCIONES DE LECTURA/ESCRITURA
// ============================================================

export function leerCart(){
  try{ 
    return JSON.parse(localStorage.getItem(LS_CART) || "[]"); 
  } catch { 
    return []; 
  }
}

export function guardarCart(c){
  localStorage.setItem(LS_CART, JSON.stringify(c));
  pintarBadge();
}

// ============================================================
//                 OPERACIONES DEL CARRITO
// ============================================================

export function agregarAlCarrito(id, precio){
  const cart = leerCart();
  const i = cart.findIndex(x => x.id === id);
  
  if(i >= 0) {
    cart[i].qty += 1;
  } else {
    cart.push({id, qty: 1, precio});
  }
  
  guardarCart(cart);
  showToast("✅ Producto agregado al carrito");
}

export function quitarDelCarrito(id){
  const nuevo = leerCart().filter(x => x.id !== id);
  guardarCart(nuevo);
  showToast("🗑️ Producto eliminado del carrito");
}

// ============================================================
//           ACTUALIZAR CANTIDAD (SIN RE-RENDER)
// ============================================================

export function actualizarCantidad(id, nuevaCantidad){
  const cart = leerCart();
  const item = cart.find(x => x.id === id);
  
  if(item) {
    // Validar cantidad mínima y máxima
    item.qty = Math.max(1, Math.min(999, parseInt(nuevaCantidad) || 1));
    guardarCart(cart);
    return item.qty; // Retornar la cantidad validada
  }
  
  return null;
}

// ============================================================
//           INCREMENTAR/DECREMENTAR (OPTIMIZADO)
// ============================================================

export function cambiarCantidad(id, delta){
  const cart = leerCart();
  const item = cart.find(x => x.id === id);
  
  if(item) {
    item.qty = Math.max(1, item.qty + delta);
    guardarCart(cart);
    return item.qty;
  }
  
  return null;
}

// ============================================================
//                    VACIAR CARRITO
// ============================================================

export function vaciarCarrito(){
  localStorage.removeItem(LS_CART);
  pintarBadge();
  showToast("🗑️ Carrito vaciado");
}

// ============================================================
//                  ACTUALIZAR BADGE
// ============================================================

export function pintarBadge(){
  const el = $("#cart-link");
  if(!el) return;
  
  const cart = leerCart();
  const count = cart.reduce((a, b) => a + b.qty, 0);
  
  if(count > 0) {
    el.innerHTML = `🛒 Carrito <span class="badge-cart">${count}</span>`;
  } else {
    el.textContent = "🛒 Carrito (0)";
  }
}

// ============================================================
//                  CALCULAR TOTAL
// ============================================================

export function calcularTotal(productos){
  const cart = leerCart();
  const index = Object.fromEntries(productos.map(p => [p.id, p]));
  
  return cart.reduce((total, item) => {
    const producto = index[item.id];
    const precio = producto?.precio ?? item.precio ?? 0;
    return total + (precio * item.qty);
  }, 0);
}

// ============================================================
//               OBTENER ITEMS DEL CARRITO
// ============================================================

export function obtenerItemsCarrito(){
  return leerCart();
}