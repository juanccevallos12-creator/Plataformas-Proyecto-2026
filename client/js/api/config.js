// client/js/api/config.js

// Detectar si estamos en producción por el hostname
const isProduction = typeof window !== 'undefined' && 
                     (window.location.hostname.includes('netlify.app') || 
                      window.location.hostname !== 'localhost');

export const API_URL = isProduction 
  ? "https://new-era-tech-api.onrender.com"
  : "http://localhost:3800";

console.log("🔧 Entorno:", isProduction ? "PRODUCCIÓN" : "DESARROLLO");
console.log("🔧 API URL configurada:", API_URL);