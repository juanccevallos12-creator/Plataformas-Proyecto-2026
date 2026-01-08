// client/js/config.js

// En producción usa la variable de entorno, en desarrollo usa localhost
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3800";

console.log("🔧 API URL configurada:", API_URL);