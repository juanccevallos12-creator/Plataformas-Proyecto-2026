// /client/js/logic/productosLogic.js

import { getProductos } from "../api/productos.js";
import { agregarAlCarrito } from "../state/cart.js";
import { $, $$, showToast } from "../utils.js";

// ============================================================
//                       TEMPLATE CARD
// ============================================================
function badgeDisponibilidad(p){
  if(p.stock > 0) return `<span class="badge ok">Disponible</span>`;
  return `<span class="badge soon">Próximamente</span>`;
}

function coloresDisponibles(p){
  // Manejar diferentes formatos de colores
  let colores = [];
  
  try {
    if (!p.colores) return "";
    
    // Si es un string JSON, parsearlo
    if (typeof p.colores === 'string') {
      colores = JSON.parse(p.colores);
    } 
    // Si ya es un array, usarlo directamente
    else if (Array.isArray(p.colores)) {
      colores = p.colores;
    }
    
    if (!colores.length) return "";
    
    return colores
      .map(c => `<span class="badge ${c.disponible ? 'ok' : 'soon'}">${c.color}</span>`)
      .join(" ");
  } catch (error) {
    console.warn("Error parseando colores:", error);
    return "";
  }
}

function cardProducto(p){
  return `
    <li class="card">
      <div class="thumb">
        <img src="${p.imagen.replace('./', '/')}" alt="${p.nombre}">
      </div>

      <div class="meta">
        <h3>${p.nombre}</h3>
        <span class="price">$${p.precio.toFixed(2)}</span>
      </div>

      <div class="kv">
        <p>${p.resena}</p>
        <p>${badgeDisponibilidad(p)} &nbsp; ${coloresDisponibles(p)}</p>

        <p style="margin:.4rem 0 0 0; font-size:.85rem">
          ${Array.isArray(p.specs) ? p.specs.slice(0,3).join(" · ") : ""}
        </p>

        <div class="cta" style="margin-top:.6rem">
          <button class="btn btn-primary btn-add"
                  data-id="${p.id}" 
                  data-precio="${p.precio}">
            Añadir al carrito
          </button>

          <button class="btn btn-more" data-id="${p.id}">
            Ver más
          </button>
        </div>
      </div>
    </li>
  `;
}

// ============================================================
//                FILTROS BÁSICOS + AVANZADOS
// ============================================================

function marcasUnicas(list){
  return [...new Set(list.map(p => p.marca))].sort();
}

function boundsPrecio(list){
  if(!list.length) return [0, 0];
  const min = Math.min(...list.map(p => p.precio));
  const max = Math.max(...list.map(p => p.precio));
  return [Math.floor(min), Math.ceil(max)];
}

function ordenar(list, criterio){
  const arr = [...list];
  switch(criterio){
    case "precio-asc": arr.sort((a,b)=> a.precio - b.precio); break;
    case "precio-desc": arr.sort((a,b)=> b.precio - a.precio); break;
    case "nombre-asc": arr.sort((a,b)=> a.nombre.localeCompare(b.nombre)); break;
    case "stock-desc": arr.sort((a,b)=> (b.stock||0) - (a.stock||0)); break;
  }
  return arr;
}

function aplicarFiltrosAvanzados(list){
  const q = ($("#q")?.value ?? "").toLowerCase();
  const cat = $("#cat")?.value ?? "";
  const marca = $("#marca")?.value ?? "";
  const pmin = Number($("#pmin")?.value ?? 0);
  const pmax = Number($("#pmax")?.value ?? 9999999);
  const orden = $("#orden")?.value ?? "";

  let res = list.filter(p=>{
    const okQ = !q || p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q);
    const okC = !cat || p.categoria === cat;
    const okM = !marca || p.marca === marca;
    const okP = p.precio >= pmin && p.precio <= pmax;
    return okQ && okC && okM && okP;
  });

  return ordenar(res, orden);
}

async function enhanceFiltros(data){
  const f = $("#filtros");
  if(!f) return;

  const marcas = marcasUnicas(data);
  const [pmin, pmax] = boundsPrecio(data);

  const bloque = document.createElement("div");
  bloque.className = "grid";
  bloque.style.gridTemplateColumns = "1fr 1fr";
  bloque.style.gap = ".6rem";

  bloque.innerHTML = `
    <select id="marca" aria-label="Marca">
      <option value="">Todas las marcas</option>
      ${marcas.map(m => `<option>${m}</option>`).join("")}
    </select>

    <select id="orden" aria-label="Ordenar por">
      <option value="">Ordenar por…</option>
      <option value="precio-asc">Precio: menor a mayor</option>
      <option value="precio-desc">Precio: mayor a menor</option>
      <option value="nombre-asc">Nombre (A-Z)</option>
      <option value="stock-desc">Stock (mayor primero)</option>
    </select>

    <label>
      Precio mín.
      <input id="pmin" type="number" min="0" value="${pmin}">
    </label>

    <label>
      Precio máx.
      <input id="pmax" type="number" min="${pmin}" value="${pmax}">
    </label>
  `;

  f.appendChild(bloque);
}

// ============================================================
//                    RENDER PRINCIPAL DEL CATÁLOGO
// ============================================================

export async function renderProductos(){
  const el = $("#grid-productos");
  
  // ✅ VALIDACIÓN CRÍTICA - Esto faltaba
  if(!el) {
    console.error("❌ No se encontró #grid-productos en el DOM");
    return;
  }

  console.log("✅ Elemento encontrado, iniciando carga...");
  el.innerHTML = "<li>Cargando productos...</li>";

  try {
    // Llamada a la API
    const data = await getProductos();
    console.log("✅ Productos cargados:", data.length);

    // Validar que data sea un array
    if(!Array.isArray(data)) {
      throw new Error("La API no devolvió un array de productos");
    }

    // Añadir filtros avanzados dinámicamente
    await enhanceFiltros(data);

    // Función para pintar productos
    const pintar = ()=>{
      const filtrados = aplicarFiltrosAvanzados(data);
      console.log("🔍 Productos filtrados:", filtrados.length);

      if(filtrados.length === 0) {
        el.innerHTML = "<li>No se encontraron productos con esos filtros.</li>";
        return;
      }

      el.innerHTML = filtrados.map(cardProducto).join("");
    };

    // Eventos de filtros
    $$("#filtros input, #filtros select").forEach(i =>
      i.addEventListener("input", pintar)
    );

    // Renderizar inicial
    pintar();

    // Delegación de eventos del grid
    el.addEventListener("click", (e)=>{
      // AÑADIR AL CARRITO
      const add = e.target.closest(".btn-add");
      if(add){
        agregarAlCarrito(add.dataset.id, Number(add.dataset.precio || 0));
        return;
      }

      // VER DETALLE (SPA)
      const more = e.target.closest(".btn-more");
      if(more){
        const id = more.dataset.id;
        location.hash = `#/producto/${id}`;
      }
    });

  } catch(error) {
    console.error("❌ ERROR cargando catálogo:", error);
    el.innerHTML = `
      <li style="padding: 2rem; text-align: center;">
        <p style="color: #e74c3c; margin-bottom: 0.5rem;">Error cargando catálogo</p>
        <p style="font-size: 0.9rem; color: #7f8c8d;">${error.message}</p>
        <button class="btn" onclick="location.reload()">Reintentar</button>
      </li>
    `;
  }
}