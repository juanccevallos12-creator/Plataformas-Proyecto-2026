// /client/js/logic/contactoLogic.js

import { $, showToast } from "../utils.js";

// ================================
//        VALIDACIÓN GENERAL
// ================================
function validarContacto(d) {
  const errores = [];

  if (!d.nombre || d.nombre.trim().length < 3)
    errores.push("El nombre es demasiado corto.");

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!d.email || !emailRegex.test(d.email))
    errores.push("El correo electrónico no es válido.");

  const telRegex = /^[0-9+\-\s]{7,20}$/;
  if (!d.telefono || !telRegex.test(d.telefono))
    errores.push("El número de teléfono es inválido.");

  if (!d.asunto || d.asunto.trim().length < 3)
    errores.push("El asunto es muy corto.");

  if (!d.mensaje || d.mensaje.trim().length < 10)
    errores.push("El mensaje debe tener al menos 10 caracteres.");

  if (!d.acepto)
    errores.push("Debes aceptar el uso de datos personales.");

  return errores;
}

// ======================================
//     GUARDADO LOCAL (localStorage)
// ======================================
function leerBuzon() {
  return JSON.parse(localStorage.getItem("net_contactos") || "[]");
}

function guardarBuzon(lista) {
  localStorage.setItem("net_contactos", JSON.stringify(lista));
}

// ======================================
//        EXPORTACIÓN LOCAL A TXT
// ======================================
function exportarTXTLocal(entries) {
  const text = entries.map(e =>
    `${e.fecha}\t${e.nombre}\t${e.email}\t${e.telefono}\t${e.asunto}\t${e.mensaje.replace(/\n/g, ' ')}`
  ).join("\n");

  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "contactos_export.txt";
  document.body.appendChild(a);
  a.click();

  URL.revokeObjectURL(a.href);
  a.remove();
}

// ======================================
//           RENDER Y LÓGICA SPA
// ======================================
export function renderContacto() {
  const form = $("#form-contacto");
  if (!form) return;

  const alerta = $("#alerta");
  const btnExportar = $("#btn-exportar");

  // ----------- Helper para mostrar alertas -----------
  const mostrarAlerta = (msg, tipo = "error") => {
    alerta.textContent = msg;
    alerta.className = `alerta ${tipo}`;
    alerta.style.display = "block";
    setTimeout(() => alerta.style.display = "none", 4000);
  };

  // ----------- EXPORTAR A TXT -----------
  btnExportar?.addEventListener("click", () => {
    const data = leerBuzon();
    if (data.length === 0) {
      mostrarAlerta("No hay contactos guardados para exportar.", "error");
      return;
    }
    exportarTXTLocal(data);
  });

  // ----------- SUBMIT DEL FORMULARIO -----------
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
      nombre: $("#c-nombre").value.trim(),
      email: $("#c-email").value.trim(),
      telefono: $("#c-telefono").value.trim(),
      asunto: $("#c-asunto").value.trim(),
      mensaje: $("#c-mensaje").value.trim(),
      acepto: $("#c-acepto").checked
    };

    // VALIDACIÓN
    const errores = validarContacto(data);
    if (errores.length > 0) {
      mostrarAlerta("⚠️ Corrige los errores: " + errores.join(" "), "error");
      return;
    }

    const payload = { ...data, fecha: new Date().toISOString() };

    try {
      // MODO LOCAL
      if (!window.BACKEND) {
        const buz = leerBuzon();
        buz.push(payload);
        guardarBuzon(buz);
      }

      // MODO BACKEND (ENVÍO A EXPRESS)
      else {
        const res = await fetch("/api/contactos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Error HTTP");
      }

      mostrarAlerta("Mensaje enviado correctamente. ¡Gracias por contactarnos!", "ok");
      form.reset();

    } catch (error) {
      mostrarAlerta("No se pudo guardar o enviar el mensaje. Intenta más tarde.", "error");
    }
  });
}
