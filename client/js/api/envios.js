// client/js/api/envios.js

import { fetchJSON } from "../utils.js";

export async function calcularEnvio(ciudad) {
  return await fetchJSON("/api/envios/calcular", {
    method: "POST",
    body: JSON.stringify({ ciudad }),
  });
}

export async function guardarDireccionEnvio(data) {
  return await fetchJSON("/api/envios", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
