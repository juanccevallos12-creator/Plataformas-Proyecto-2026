// client/js/api/contacto.js

import { fetchJSON } from "../utils.js";

export async function enviarContacto(data) {
  return await fetchJSON("/api/contactos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
