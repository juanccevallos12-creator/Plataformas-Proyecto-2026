// /client/js/views/perfil.js

import { getUser, requireAuth } from "../state/session.js";

export function PerfilView() {
  if (!requireAuth()) {
    return `<div class="container"><p>Redirigiendo...</p></div>`;
  }

  const user = getUser();

  return `
    <div class="container">
      <div class="perfil-wrapper">
        
        <div class="perfil-header">
          <div class="perfil-avatar-large">
            ${user.nombre?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1>${user.nombre || 'Usuario'}</h1>
            <p class="perfil-email">${user.email}</p>
            <span class="badge-role">${getRoleLabel(user.rol)}</span>
          </div>
        </div>

        <div class="perfil-grid">
          
          <div class="perfil-card">
            <h2>📋 Información Personal</h2>
            <div class="perfil-info">
              <div class="info-item">
                <span class="info-label">Nombre:</span>
                <span class="info-value">${user.nombre || 'No especificado'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">${user.email}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Rol:</span>
                <span class="info-value">${getRoleLabel(user.rol)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ID:</span>
                <span class="info-value">${user.id}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Estado:</span>
                <span class="info-value">
                  <span class="badge ${user.activo ? 'ok' : 'soon'}">
                    ${user.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div class="perfil-card">
            <h2>🔐 Seguridad</h2>
            <div class="perfil-actions">
              <button class="btn" onclick="alert('Funcionalidad en desarrollo')">
                🔑 Cambiar Contraseña
              </button>
              <button class="btn btn-secondary" onclick="alert('Funcionalidad en desarrollo')">
                📧 Cambiar Email
              </button>
            </div>
          </div>

          <div class="perfil-card">
            <h2>⚙️ Permisos</h2>
            <div class="permisos-list">
              ${(user.permisos || []).map(p => `
                <div class="permiso-item">
                  <span class="permiso-icon">✓</span>
                  <span>${getPermisoLabel(p)}</span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}

export function initPerfil() {
  requireAuth();
}

function getRoleLabel(rol) {
  const labels = {
    admin: "Administrador",
    vendedor: "Vendedor",
    cliente: "Cliente"
  };
  return labels[rol] || "Usuario";
}

function getPermisoLabel(permiso) {
  const labels = {
    crear: "Crear productos",
    editar: "Editar productos",
    eliminar: "Eliminar productos",
    ver: "Ver catálogo"
  };
  return labels[permiso] || permiso;
}