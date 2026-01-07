// client/js/api/carrito.js

import { fetchJSON } from "../utils.js";

// Crear carrito (opcional)
export async function crearCarrito() {
  return await fetchJSON("/api/carrito", { method: "POST" });
}

// Actualizar productos del carrito
export async function actualizarCarrito(idCarrito, productos) {
  return await fetchJSON(`/api/carrito/${idCarrito}`, {
    method: "PUT",
    body: JSON.stringify({ productos }),
  });
}

// Vaciar carrito
export async function eliminarCarrito(idCarrito) {
  return await fetchJSON(`/api/carrito/${idCarrito}`, { method: "DELETE" });
}

// Enviar carrito → pedido
export async function checkoutCarrito(idCarrito) {
  return await fetchJSON(`/api/carrito/${idCarrito}/checkout`, {
    method: "POST",
  });
}
