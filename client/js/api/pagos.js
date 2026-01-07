// client/js/api/pagos.js

import { fetchJSON } from "../utils.js";

export async function procesarPago(data) {
  return await fetchJSON("/api/pagos/pagar", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
