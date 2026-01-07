// /client/js/api/auth.js

import { fetchJSON } from "../utils.js";
import { API_URL } from "./config.js";

/* ================================
      AUTENTICACIÓN API
=================================== */

export async function loginUser(credentials) {
  const res = await fetchJSON(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  return res;
}

export async function registerUser(userData) {
  const res = await fetchJSON(`${API_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify(userData),
  });
  return res;
}

export async function verifyToken(token) {
  const res = await fetchJSON(`${API_URL}/auth/verify`, {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  return res;
}

export async function cambiarPassword(data) {
  const res = await fetchJSON(`${API_URL}/auth/change-password`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res;
}