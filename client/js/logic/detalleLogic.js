// /client/js/logic/detalleLogic.js

import { getProductos } from "../api/productos.js";
import { agregarAlCarrito } from "../state/cart.js";
import { $, fmtUSD } from "../utils.js";

// Helpers pequeños reutilizados
function badgeDisponibilidad(p){
  if(p.stock > 0) return `<span class="badge ok">Disponible</span>`;
  return `<span class="badge soon">Próximamente</span>`;
}

function coloresDisponibles(p){
  if(!p.colores?.length) return "";
  return p.colores
    .map(c => `<span class="badge ${c.disponible ? 'ok' : 'soon'}">${c.color}</span>`)
    .join(" ");
}


// ============================================================
//              CARGAR DETALLE DEL PRODUCTO
// ============================================================
export async function renderDetalle(){
  const host = $("#vista-detalle");
  if(!host) return;

  // obtener ID desde la ruta SPA (#/producto/ID)
  const hash = location.hash.split("/");
  const id = hash[2];

  if(!id){
    host.innerHTML = `<p>Producto no especificado.</p>`;
    return;
  }

  host.innerHTML = `<p>Cargando…</p>`;

  try {
    const data = await getProductos();
    const p = data.find(x => x.id === id);

    if(!p){
      host.innerHTML = `<p>Producto no encontrado.</p>`;
      return;
    }

    // ===========================
    //        RENDER DEL DETALLE
    // ===========================
    host.innerHTML = `
      <article class="card" style="overflow:hidden">
        
        <div class="thumb">
          <img src="${p.imagen}" alt="${p.nombre}">
        </div>

        <div class="kv" style="padding:1rem">

          <h1 style="margin:.2rem 0">${p.nombre}</h1>

          <p>
            ${badgeDisponibilidad(p)}
            &nbsp;
            ${coloresDisponibles(p)}
          </p>

          <p class="price" style="font-size:1.2rem">
            ${fmtUSD(p.precio)}
          </p>

          <p>${p.resena}</p>

          <ul style="margin-top:.6rem">
            ${p.specs.map(s => `<li>${s}</li>`).join("")}
          </ul>

          <div class="cta" style="margin-top:1rem;">
            <button class="btn btn-primary" 
                    id="add-detalle" 
                    data-id="${p.id}" 
                    data-precio="${p.precio}">
              Añadir al carrito
            </button>

            <a class="btn" href="#/productos">Volver</a>
          </div>

        </div>

      </article>
    `;

    // Evento: añadir desde detalle
    $("#add-detalle")?.addEventListener("click", e=>{
      agregarAlCarrito(e.target.dataset.id, Number(e.target.dataset.precio || 0));
    });

  } catch {
    host.innerHTML = `<p>Error cargando producto.</p>`;
  }
}
