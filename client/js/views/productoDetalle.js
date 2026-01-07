// /js/views/productoDetalle.js

import { renderDetalle } from "../logic/detalleLogic.js";

export function ProductoDetalleView(id){
  return `
    <div class="container" id="vista-detalle">
      <p>Cargando…</p>
    </div>
  `;
}

export function initProductoDetalle(){
  renderDetalle(); // ← toda tu lógica original
}
