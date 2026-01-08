// client/js/api/envios.js

import { fetchJSON } from "../utils.js";
import { API_URL } from "./config.js";

export async function calcularEnvio(ciudad) {
  return await fetchJSON(`${API_URL}/api/envios/calcular`, {
    method: "POST",
    body: JSON.stringify({ ciudad }),
  });
}

export async function guardarDireccionEnvio(data) {
  return await fetchJSON(`${API_URL}/api/envios`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}