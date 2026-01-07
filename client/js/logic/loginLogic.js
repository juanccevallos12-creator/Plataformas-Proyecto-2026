// client/js/logic/loginLogic.js

import { setUser, setToken } from "../state/session.js";
import { loginUser } from "../api/auth.js";
import { $, showToast } from "../utils.js";

export function renderLogin() {
  const form = $("#form-login");
  if (!form) return;

  const estado = $("#l-estado");
  const btnSubmit = form.querySelector(".btn-login");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

  // Mostrar credenciales demo
  mostrarCredencialesDemo();

  // Evento submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = $("#l-email").value.trim();
    const pass = $("#l-pass").value.trim();

    // Limpiar estado
    estado.textContent = "";
    estado.className = "estado";

    // VALIDACIONES
    if (!emailRegex.test(email)) {
      mostrarError("Ingresa un correo electrónico válido");
      return;
    }

    if (pass.length < 6) {
      mostrarError("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    // Deshabilitar botón
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Iniciando sesión...";

    try {
      // Llamar al backend
      const respuesta = await loginUser({ email, password: pass });
      
      console.log('📥 Respuesta del servidor:', respuesta); // DEBUG

      if (respuesta.status === "success") {
        // ✅ CORRECCIÓN: Desestructurar correctamente
        const { user, token } = respuesta.data;
        
        console.log('👤 Usuario:', user); // DEBUG
        console.log('🔑 Token:', token ? 'Recibido' : 'No recibido'); // DEBUG

        // Guardar sesión
        setUser(user);
        if (token) {
          setToken(token);
        }

        showToast(`✅ Bienvenido, ${user.nombre}!`);

        // Redirección según rol
        setTimeout(() => {
          if (user.rol === "admin") {
            console.log('🔄 Redirigiendo a admin...'); // DEBUG
            location.hash = "#/admin";
          } else if (user.rol === "vendedor") {
            console.log('🔄 Redirigiendo a productos...'); // DEBUG
            location.hash = "#/productos";
          } else {
            console.log('🔄 Redirigiendo a home...'); // DEBUG
            location.hash = "#/";
          }
        }, 700);

      } else {
        mostrarError(respuesta.message || "Credenciales incorrectas");
      }

    } catch (error) {
      console.error("❌ Error en login:", error);
      
      if (error.message?.includes("Failed to fetch")) {
        mostrarError("No se pudo conectar con el servidor. Verifica que esté ejecutándose.");
      } else if (error.message?.includes("401")) {
        mostrarError("Email o contraseña incorrectos");
      } else {
        mostrarError(error.message || "Error al iniciar sesión. Intenta nuevamente.");
      }
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Iniciar sesión";
    }
  });

  // Función para mostrar errores
  function mostrarError(mensaje) {
    estado.textContent = mensaje;
    estado.className = "estado error";
  }
}

// ============================================================
//              CREDENCIALES DE PRUEBA (DEMO)
// ============================================================

export function mostrarCredencialesDemo() {
  const form = $("#form-login");
  if (!form) return;

  // Verificar si ya existe
  if (document.querySelector(".demo-credentials")) return;

  const demoBox = document.createElement("div");
  demoBox.className = "demo-credentials";
  demoBox.innerHTML = `
    <p><strong>🔐 Credenciales de prueba:</strong></p>
    <div class="demo-users">
      <div class="demo-user" data-email="admin@neweratech.com" data-pass="admin123">
        <strong>👨‍💼 Administrador</strong>
        <small>admin@neweratech.com</small>
        <small>Contraseña: admin123</small>
      </div>
      <div class="demo-user" data-email="vendedor@neweratech.com" data-pass="vendedor123">
        <strong>👨‍💻 Vendedor</strong>
        <small>vendedor@neweratech.com</small>
        <small>Contraseña: vendedor123</small>
      </div>
      <div class="demo-user" data-email="cliente@gmail.com" data-pass="cliente123">
        <strong>👤 Cliente</strong>
        <small>cliente@gmail.com</small>
        <small>Contraseña: cliente123</small>
      </div>
    </div>
  `;

  form.parentElement.appendChild(demoBox);

  // Auto-llenar al hacer click
  demoBox.addEventListener("click", (e) => {
    const demoUser = e.target.closest(".demo-user");
    if (!demoUser) return;

    $("#l-email").value = demoUser.dataset.email;
    $("#l-pass").value = demoUser.dataset.pass;
    
    // Feedback visual
    demoUser.style.background = "rgba(58, 161, 255, 0.3)";
    setTimeout(() => {
      demoUser.style.background = "";
    }, 300);
  });
}