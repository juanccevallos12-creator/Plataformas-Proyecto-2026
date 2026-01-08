// client/js/api/contacto.js

import { fetchJSON } from "../utils.js";
import { API_URL } from "./config.js";

export async function enviarContacto(data) {
  return await fetchJSON(`${API_URL}/api/contactos`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}