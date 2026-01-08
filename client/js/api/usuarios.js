// client/js/api/usuarios.js

import { fetchJSON } from "../utils.js";
import { API_URL } from "./config.js";

export async function login(email, password) {
  return await fetchJSON(`${API_URL}/api/usuarios/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registrarUsuario(data) {
  return await fetchJSON(`${API_URL}/api/usuarios/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getUsuario(id) {
  return await fetchJSON(`${API_URL}/api/usuarios/${id}`);
}