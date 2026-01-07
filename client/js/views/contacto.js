// /client/js/views/contacto.js

import { renderContacto } from "../logic/contactoLogic.js";

export function ContactoView(){
  return `
    <div class="container">
      <div class="contact-wrapper">

        <div class="contact-header">
          <h1>Contacto</h1>
          <p>¿Necesitas asesoría para elegir tu equipo ideal? Estamos aquí para ayudarte.</p>
        </div>

        <form id="form-contacto" class="contact-form" novalidate>
          
          <div id="alerta" class="alerta" role="alert"></div>

          <div class="form-grid">

            <div class="form-group">
              <label for="c-nombre">Nombre y apellido</label>
              <input 
                id="c-nombre" 
                type="text"
                placeholder="Juan Pérez"
                required 
                minlength="3"
                autocomplete="name">
            </div>

            <div class="form-group">
              <label for="c-email">Correo electrónico</label>
              <input 
                id="c-email" 
                type="email" 
                placeholder="juan@ejemplo.com"
                required
                autocomplete="email">
            </div>

            <div class="form-group">
              <label for="c-telefono">Teléfono</label>
              <input 
                id="c-telefono" 
                type="tel"
                placeholder="+593 99 123 4567"
                required 
                pattern="^[0-9+\\-\\s]{7,20}$"
                autocomplete="tel">
            </div>

            <div class="form-group">
              <label for="c-asunto">Asunto</label>
              <input 
                id="c-asunto" 
                type="text"
                placeholder="Consulta sobre laptops gaming"
                required 
                minlength="3">
            </div>

            <div class="form-group">
              <label for="c-mensaje">Mensaje</label>
              <textarea 
                id="c-mensaje" 
                rows="5" 
                placeholder="Cuéntanos qué necesitas y te ayudaremos a encontrar el equipo perfecto..."
                required 
                minlength="10"></textarea>
            </div>

            <div class="form-check">
              <input id="c-acepto" type="checkbox" required>
              <label for="c-acepto">Acepto el uso de mis datos para responder a mi consulta.</label>
            </div>

          </div>

          <div class="cta" style="justify-content:flex-end">
            <button type="button" id="btn-exportar" class="btn">
              📄 Exportar TXT
            </button>
            <button type="submit" class="btn btn-primary">
              ✉️ Enviar mensaje
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}

export function initContacto(){
  renderContacto();
}
