// client/js/api/productos.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ================================
        SUPABASE CONFIG
=================================== */

const SUPABASE_URL = "https://dvmqluaymcpjeegmgykr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bXFsdWF5bWNwamVlZ21neWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2OTQ1OTUsImV4cCI6MjA4MzI3MDU5NX0.iEPhhlavUp7HfDVwMjTHRFNgJEoDNp5H20Hctmy689E";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ================================
        PRODUCTOS API
=================================== */

export async function getProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*");

  if (error) {
    console.error("❌ Supabase error:", error);
    throw new Error("No se pudo cargar el catálogo");
  }

  return data;
}

export async function getProductoById(id) {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ Supabase error:", error);
    throw new Error("Producto no encontrado");
  }

  return data;
}
