// /client/js/logic/homeLogic.js

import { getProductos } from "../api/productos.js";
import { agregarAlCarrito } from "../state/cart.js";
import { $, $$, showToast } from "../utils.js";

// ---------------------
//     TEMPLATE CARD
// ---------------------
function cardProducto(p){
  return `
    <li class="card">
      <div class="thumb"><img src="${p.imagen}" alt="${p.nombre}"></div>

      <div class="meta">
        <h3>${p.nombre}</h3>
        <span class="price">${new Intl.NumberFormat('es-EC', {
          style:'currency', currency:'USD'
        }).format(p.precio)}</span>
      </div>

      <div class="kv">
        <p>${p.resena}</p>
        <p>${badgeDisponibilidad(p)} &nbsp; ${coloresDisponibles(p)}</p>
        <p style="margin:.4rem 0 0 0; font-size:.85rem">
          ${p.specs.slice(0,3).join(" · ")}
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

// -----------------------------
//    DISPONIBILIDAD Y COLORES
// -----------------------------
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


// ---------------------
//   RENDER DESTACADOS
// ---------------------
export async function renderHome(){

  const grid = $("#grid-destacados");
  if(!grid) return;

  grid.innerHTML = "<li>Cargando...</li>";

  try{
    const response = await getProductos();
    const data = response.data || response;
    const destacados = data.slice(0, 6);

    grid.innerHTML = destacados.map(cardProducto).join("");

    //-------------------------------
    // Delegación de eventos
    //-------------------------------
    grid.addEventListener("click", (e)=>{

      // BOTÓN AÑADIR
      const add = e.target.closest(".btn-add");
      if(add){
        agregarAlCarrito(add.dataset.id, Number(add.dataset.precio || 0));
        return;
      }

      // BOTÓN VER MÁS
      const more = e.target.closest(".btn-more");
      if(more){
        const prod = data.find(x => x.id === more.dataset.id);
        const card = more.closest(".card");
        if(!card || !prod) return;

        // si ya está abierto → cerrar
        let details = card.querySelector(".extra-info");
        if(details){
          details.remove();
          return;
        }

        const info = document.createElement("div");
        info.className = "extra-info";

        info.innerHTML = `
          <div class="carousel">
            <button class="prev">◀</button>
            <div class="slides">
              ${(prod.imagenes || [prod.imagen])
                .map(src => `<img src="${src}" alt="${prod.nombre}" class="slide">`)
                .join("")}
            </div>
            <button class="next">▶</button>
          </div>

          <p style="margin-top:.6rem">${prod.resena}</p>

          <ul style="margin:.4rem 0 0 1rem;font-size:.9rem">
            ${prod.specs.map(s=>`<li>${s}</li>`).join("")}
          </ul>
        `;

        card.appendChild(info);

        // Carrusel funcional
        const slides = info.querySelectorAll(".slide");
        let i = 0;
        slides.forEach((img, idx)=> img.style.display = idx === 0 ? "block" : "none");

        info.querySelector(".prev").onclick = ()=>{
          slides[i].style.display = "none";
          i = (i - 1 + slides.length) % slides.length;
          slides[i].style.display = "block";
        };

        info.querySelector(".next").onclick = ()=>{
          slides[i].style.display = "none";
          i = (i + 1) % slides.length;
          slides[i].style.display = "block";
        };
      }

    });

  } catch (e) {
    grid.innerHTML = "<li>Error cargando destacados.</li>";
  }

}
