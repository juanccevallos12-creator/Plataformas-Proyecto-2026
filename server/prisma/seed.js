import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const load = (name) =>
  JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "prisma/data", `${name}.json`),
      "utf8"
    )
  );

async function main() {
  console.log("🌱 Iniciando seed de Supabase...");

  // ===== SEGURIDAD Y CONFIGURACIÓN =====
  await prisma.rol.createMany({ data: load("roles"), skipDuplicates: true });
  await prisma.usuario.createMany({ data: load("usuarios"), skipDuplicates: true });

  // ===== UBICACIÓN =====
  await prisma.pais.createMany({ data: load("paises"), skipDuplicates: true });
  await prisma.ciudad.createMany({ data: load("ciudades"), skipDuplicates: true });

  // ===== CATÁLOGOS =====
  await prisma.categoria.createMany({ data: load("categorias"), skipDuplicates: true });
  await prisma.unidadMedida.createMany({ data: load("unidades_medidas"), skipDuplicates: true });
  await prisma.formaPago.createMany({ data: load("forma_pago"), skipDuplicates: true });
  await prisma.estado.createMany({ data: load("estados"), skipDuplicates: true });

  // ===== INVENTARIO =====
  await prisma.bodega.createMany({ data: load("bodegas"), skipDuplicates: true });
  await prisma.proveedor.createMany({ data: load("proveedores"), skipDuplicates: true });
  await prisma.producto.createMany({ data: load("productos"), skipDuplicates: true });
  await prisma.movimiento.createMany({ data: load("movimientos"), skipDuplicates: true });

  // ===== CLIENTES =====
  await prisma.cliente.createMany({ data: load("clientes"), skipDuplicates: true });
  await prisma.ubicacion.createMany({ data: load("ubicaciones"), skipDuplicates: true });

  // ===== COMERCIAL =====
  await prisma.pedido.createMany({ data: load("pedidos"), skipDuplicates: true });
  await prisma.pedidoItem.createMany({ data: load("pedido_items"), skipDuplicates: true });
  await prisma.factura.createMany({ data: load("facturas"), skipDuplicates: true });
  await prisma.pago.createMany({ data: load("pagos"), skipDuplicates: true });
  await prisma.envio.createMany({ data: load("envios"), skipDuplicates: true });

  // ===== PROMOCIONES =====
  await prisma.descuento.createMany({ data: load("descuentos"), skipDuplicates: true });
  await prisma.carrito.createMany({ data: load("carrito"), skipDuplicates: true });

  // ===== SOPORTE =====
  await prisma.contacto.createMany({ data: load("contactos"), skipDuplicates: true });
  await prisma.ajuste.createMany({ data: load("ajustes"), skipDuplicates: true });
  await prisma.bitacora_operaciones.createMany({
    data: load("bitacora_operaciones"),
    skipDuplicates: true
  });

  console.log("✅ Seed completado correctamente");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
