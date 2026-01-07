import { renderCarrito } from "../logic/carritoLogic.js";

export function CarritoView(){
  return `
    <div class="container">
      <h1>Carrito</h1>
      <div id="carrito-vista"></div>
    </div>
  `;
}

export function initCarrito(){
  renderCarrito();
}
