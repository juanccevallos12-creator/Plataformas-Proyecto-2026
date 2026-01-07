// /js/views/productos.js

import { renderProductos } from "../logic/productosLogic.js"; 
// (Esta lógica la movemos en Fase 4)

export function ProductosView() {
  return `
    <div class="container">

      <h1 style="margin:1.2rem 0;">Catálogo</h1>

      <form id="filtros" class="grid" 
            style="grid-template-columns:1fr; gap:.6rem; margin:.5rem 0 1rem">
        
        <input id="q" placeholder="Buscar por nombre o marca…" aria-label="Buscar">

        <select id="cat" aria-label="Categoría">
            <option value="">Todas las categorías</option>
            <option value="Laptops">Laptops</option>
            <option value="Teléfonos">Teléfonos</option>
            <option value="Componentes">Componentes</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Monitores">Monitores</option>
            <option value="Audio">Audio</option>
            <option value="Almacenamiento">Almacenamiento</option>
            <option value="Gabinetes">Gabinetes</option>
        </select>


      </form>

      <ul id="grid-productos" class="grid cards-3" aria-live="polite"></ul>
    </div>
  `;
}

export function initProductos(){
  renderProductos();  // ← Tu lógica avanzada original
}
