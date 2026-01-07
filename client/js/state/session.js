// /client/js/state/session.js

import { showToast } from "../utils.js";

const LS_USER = "net_user";
const LS_TOKEN = "net_token";

// ============================================================
//                  GESTIÓN DE SESIÓN
// ============================================================

export function getUser(){
  try{ 
    return JSON.parse(localStorage.getItem(LS_USER) || "null"); 
  } catch { 
    return null; 
  }
}

export function setUser(userData){
  localStorage.setItem(LS_USER, JSON.stringify(userData));
  pintarSesion();
}

export function clearUser(){
  localStorage.removeItem(LS_USER);
  localStorage.removeItem(LS_TOKEN);
  pintarSesion();
}

// ✅ ESTAS FUNCIONES FALTABAN
export function getToken(){
  return localStorage.getItem(LS_TOKEN);
}

export function setToken(token){
  localStorage.setItem(LS_TOKEN, token);
}

// ============================================================
//                  VERIFICACIÓN DE ROL
// ============================================================

export function isAdmin(){
  const user = getUser();
  return user?.rol === "admin";
}

export function isVendedor(){
  const user = getUser();
  return user?.rol === "vendedor";
}

export function isCliente(){
  const user = getUser();
  return user?.rol === "cliente";
}

export function tienePermiso(permiso){
  const user = getUser();
  return user?.permisos?.includes(permiso) || false;
}

// ============================================================
//              PROTECCIÓN DE RUTAS
// ============================================================

export function requireAuth(requiredRole = null){
  const user = getUser();
  
  if(!user){
    showToast("⚠️ Debes iniciar sesión");
    location.hash = "#/login";
    return false;
  }
  
  if(requiredRole && user.rol !== requiredRole){
    showToast("❌ No tienes permisos para acceder");
    location.hash = "#/";
    return false;
  }
  
  return true;
}

// ============================================================
//              RENDERIZAR ESTADO DE SESIÓN
// ============================================================

export function pintarSesion(){
  const nav = document.querySelector("#user-zone");
  if(!nav) return;

  nav.innerHTML = "";
  const user = getUser();

  if(user && user.email){
    const nombre = user.nombre?.split(" ")[0] || user.email.split("@")[0];
    
    nav.innerHTML = `
      <div class="user-menu">
        <div class="user-info">
          <span class="user-avatar">${nombre.charAt(0).toUpperCase()}</span>
          <div class="user-details">
            <span class="user-name">${nombre}</span>
            <span class="user-role">${getRoleLabel(user.rol)}</span>
          </div>
        </div>
        <div class="user-dropdown">
          ${user.rol === 'admin' ? '<a href="#/admin">🛠️ Panel Admin</a>' : ''}
          ${user.rol === 'vendedor' ? '<a href="#/ventas">📊 Mis Ventas</a>' : ''}
          <a href="#/perfil">👤 Mi Perfil</a>
          <a href="#/pedidos">📦 Mis Pedidos</a>
          <a href="#" id="logout">🚪 Cerrar Sesión</a>
        </div>
      </div>
    `;
    
    // Toggle dropdown
    const userInfo = nav.querySelector(".user-info");
    const dropdown = nav.querySelector(".user-dropdown");
    
    userInfo?.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown?.classList.toggle("show");
    });
    
    // Cerrar dropdown al hacer click fuera
    document.addEventListener("click", () => {
      dropdown?.classList.remove("show");
    });
    
    // Logout
    nav.querySelector("#logout")?.addEventListener("click", e => {
      e.preventDefault();
      clearUser();
      showToast("👋 Sesión cerrada");
      location.hash = "#/";
    });
    
  } else {
    nav.innerHTML = `
      <a href="#/login" class="btn btn-login">
        🔐 Iniciar sesión
      </a>
    `;
  }
}

// ============================================================
//                  UTILIDADES
// ============================================================

function getRoleLabel(rol){
  const labels = {
    admin: "Administrador",
    vendedor: "Vendedor",
    cliente: "Cliente"
  };
  return labels[rol] || "Usuario";
}