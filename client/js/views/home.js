// /js/views/home.js

import { renderHome } from "../logic/homeLogic.js"; 
// (Crearemos este archivo en Fase 4 para alojar tu lógica original)

// ---------- VISTA ----------
export function HomeView() {
  return `
    <div class="container">

      <section class="hero">
        <article class="hero-card">

          <div class="hero-content">
            <h1>Rendimiento que despega tu estudio y trabajo</h1>
            <p>Equipos y componentes listos para desafíos reales: desarrollo, edición, gaming y universidad.</p>

            <div class="cta">
              <a class="btn btn-primary" href="#/productos">Ver catálogo</a>
              <a class="btn" href="#/ofertas">Ofertas destacadas</a>
            </div>

            <div class="hero-extra">
              <p>💻 Envíos rápidos a todo Ecuador · Garantía de fábrica · Asesoría técnica</p>
            </div>
          </div>

          <div class="thumb">
            <img src="./assets/images/hero-laptop.png" 
                 alt="Laptops y periféricos de última generación"
                 class="hero-img">
          </div>

        </article>
      </section>

      <section id="destacados" aria-labelledby="t-dest">
        <h2 id="t-dest" style="margin:1.2rem 0;">Destacados</h2>
        <ul id="grid-destacados" class="grid cards-3" aria-live="polite"></ul>
      </section>

    </div>
  `;
}

// ---------- INICIALIZADOR ----------
export function initHome(){
  renderHome();   // ← Esto trae TODA tu lógica original intacta
}
