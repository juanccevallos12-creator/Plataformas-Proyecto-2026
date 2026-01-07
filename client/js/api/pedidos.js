// /client/js/api/pedidos.js

import { fetchJSON } from "../utils.js";
import { API_URL } from "./config.js";

/* ================================
        PEDIDOS API
=================================== */

// Crear un nuevo pedido
export async function crearPedido(data) {
  const res = await fetchJSON(`${API_URL}/pedidos`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

// Obtener listado completo de pedidos
export async function getPedidos() {
  const res = await fetchJSON(`${API_URL}/pedidos`);
  return res.data;
}

// ✅ ALIAS para compatibilidad
export const obtenerPedidos = getPedidos;

// Obtener un pedido por ID
export async function getPedidoById(id) {
  const res = await fetchJSON(`${API_URL}/pedidos/${id}`);
  return res.data;
}

// ✅ ALIAS para compatibilidad
export const obtenerPedidoPorId = getPedidoById;

// Actualizar un pedido (estado u otros campos)
export async function actualizarPedido(id, data) {
  const res = await fetchJSON(`${API_URL}/pedidos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

// Eliminar / cancelar un pedido
export async function eliminarPedido(id) {
  const res = await fetchJSON(`${API_URL}/pedidos/${id}`, {
    method: "DELETE",
  });
  return res.data;
}