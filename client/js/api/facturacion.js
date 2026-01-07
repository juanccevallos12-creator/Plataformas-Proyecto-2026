// client/js/api/facturacion.js

import { fetchJSON } from "../utils.js";

// Generar factura desde pedido
export async function generarFactura(data) {
  return await fetchJSON("/api/facturacion", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Ver factura por ID
export async function getFacturaById(id) {
  return await fetchJSON(`/api/facturacion/${id}`);
}

// Listar facturas
export async function getFacturas() {
  return await fetchJSON("/api/facturacion");
}
