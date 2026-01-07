// /client/js/views/admin.js

import { requireAuth, isAdmin } from "../state/session.js";
import { renderAdminPanel, loadCollection } from "../logic/adminLogic.js";
import { MENU_SECTIONS, COLLECTIONS } from "../config/collections.js";

export function AdminView() {
  // ✅ VALIDACIÓN ÚNICA Y DEFINITIVA
  if (!requireAuth("admin")) {
    // NO retornar nada, requireAuth ya redirigió
    return ""; // ⬅️ Retornar string vacío
  }

  // Generar menú dinámicamente desde la configuración
  const menuHTML = Object.entries(MENU_SECTIONS).map(([sectionKey, section]) => `
    <div class="admin-menu-section">
      <div class="admin-menu-title">${section.title}</div>
      ${section.collections.map(collectionKey => {
        const config = COLLECTIONS[collectionKey];
        return `
          <a href="#" 
             class="admin-nav-item ${collectionKey === 'productos' ? 'active' : ''}" 
             data-collection="${collectionKey}">
            <span class="admin-nav-icon">${config.icon}</span>
            <span>${config.name}</span>
          </a>
        `;
      }).join('')}
    </div>
  `).join('');

  return `
    <div class="admin-wrapper">
      
      <!-- BOTÓN HAMBURGUESA (solo móvil) -->
      <button class="admin-burger" id="admin-burger" aria-label="Abrir menú">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- OVERLAY (para cerrar menú en móvil) -->
      <div class="admin-overlay" id="admin-overlay"></div>
      
      <!-- SIDEBAR -->
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="admin-logo">
          <h2>🛠️ Panel Admin</h2>
          <p style="font-size:0.75rem; color:#9ca3af; margin-top:0.25rem;">24 Colecciones</p>
        </div>
        
        <nav class="admin-nav">
          ${menuHTML}
        </nav>

        <div class="admin-footer">
          <a href="#/" class="btn btn-secondary">← Volver a la tienda</a>
        </div>
      </aside>

      <!-- CONTENIDO PRINCIPAL -->
      <main class="admin-content">
        <div id="admin-panel"></div>
      </main>

    </div>
  `;
}

export function initAdmin() {
  // ✅ VERIFICACIÓN DEFENSIVA (opcional pero recomendada)
  // Solo verifica, no redirige (AdminView ya lo hizo)
  if (!isAdmin()) {
    console.warn('⚠️ Acceso denegado en initAdmin');
    return;
  }

  console.log('✅ Inicializando panel admin...');

  // Renderizar panel inicial (productos por defecto)
  renderAdminPanel();

  // Event listeners para el menú lateral
  setupMenuListeners();
}

function setupMenuListeners() {
  // Burger menu para móvil
  const burger = document.getElementById('admin-burger');
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('admin-overlay');
  
  if (burger && sidebar && overlay) {
    // Abrir/cerrar menú
    burger.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
      burger.classList.toggle('active');
    });
    
    // Cerrar al hacer click en overlay
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      burger.classList.remove('active');
    });
  }

  // Event listeners del menú
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const collectionKey = item.dataset.collection;
      if (!collectionKey) return;

      // Cerrar menú en móvil después de seleccionar
      if (sidebar && overlay && burger) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        burger.classList.remove('active');
      }

      // Cargar la colección seleccionada
      await loadCollection(collectionKey);
    });
  });
}