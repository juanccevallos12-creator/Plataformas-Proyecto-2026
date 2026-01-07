// server/scripts/distribuirDatos.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const prisma = new PrismaClient();

async function distribuirDatos() {
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║  📦 DISTRIBUYENDO DATOS A TABLAS          ║');
  console.log('╚═══════════════════════════════════════════╝\n');

  try {
    await prisma.$connect();
    
    const resultados = {};

    // Distribuir cada colección
    resultados.clientes = await distribuir('clientes', migrarClientes);
    resultados.bodega = await distribuir('bodega', migrarBodega);
    resultados.proveedores = await distribuir('proveedores', migrarProveedores);
    resultados.roles = await distribuir('roles', migrarRoles);
    resultados.estados = await distribuir('estados', migrarEstados);
    resultados.forma_pago = await distribuir('forma_pago', migrarFormaPago);
    resultados.unidades_medidas = await distribuir('unidades_medidas', migrarUnidadesMedidas);
    resultados.paises = await distribuir('paises', migrarPaises);
    resultados.ciudades = await distribuir('ciudades', migrarCiudades);
    resultados.ubicaciones = await distribuir('ubicaciones', migrarUbicaciones);
    resultados.movimientos = await distribuir('movimientos', migrarMovimientos);
    resultados.ordenes_compra = await distribuir('ordenes_compra', migrarOrdenesCompra);
    resultados.facturas = await distribuir('facturas', migrarFacturas);
    resultados.pagos = await distribuir('pagos', migrarPagos);
    resultados.envios = await distribuir('envios', migrarEnvios);
    resultados.descuentos = await distribuir('descuentos', migrarDescuentos);
    resultados.ajustes = await distribuir('ajustes', migrarAjustes);
    resultados.bitacora = await distribuir('bitacora_operaciones', migrarBitacora);

    // Resumen
    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║  ✅ DISTRIBUCIÓN COMPLETADA               ║');
    console.log('╠═══════════════════════════════════════════╣');
    
    Object.entries(resultados)
      .filter(([, count]) => count > 0)
      .forEach(([tabla, count]) => {
        console.log(`║  ${tabla.padEnd(30)} ${count.toString().padStart(7)} ║`);
      });
    
    console.log('╚═══════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// ============================================================
// FUNCIÓN GENÉRICA DE DISTRIBUCIÓN
// ============================================================

async function distribuir(collectionName, migrarFunc) {
  console.log(`\n📋 Procesando: ${collectionName}`);
  
  // Leer de generic_data
  const registros = await prisma.$queryRaw`
    SELECT id, data, created_at, updated_at 
    FROM generic_data 
    WHERE collection_name = ${collectionName}
  `;
  
  if (registros.length === 0) {
    console.log('   ⏭️  Sin datos');
    return 0;
  }
  
  let migrados = 0;
  
  for (const registro of registros) {
    try {
      const doc = registro.data;
      await migrarFunc(doc, registro.created_at, registro.updated_at);
      migrados++;
    } catch (error) {
      // console.log(`   ⚠️  Error: ${error.message.substring(0, 50)}`);
    }
  }
  
  console.log(`   ✅ ${migrados}/${registros.length} migrados`);
  return migrados;
}

// ============================================================
// FUNCIONES DE MIGRACIÓN ESPECÍFICAS
// ============================================================

async function migrarClientes(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO clientes (id, nombre, email, telefono, direccion, ciudad, pais, tipo_cliente, activo, created_at, updated_at)
    VALUES (
      ${doc.id || `CLI-${Date.now()}`},
      ${doc.nombre || 'Sin nombre'},
      ${doc.email || null},
      ${doc.telefono || null},
      ${doc.direccion || null},
      ${doc.ciudad || null},
      ${doc.pais || null},
      ${doc.tipo_cliente || doc.tipo || null},
      ${doc.activo !== false},
      ${created}::timestamp,
      ${updated}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarBodega(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO bodega (id, nombre, ubicacion, capacidad, stock_actual, activo, created_at, updated_at)
    VALUES (
      ${doc.id || `BOD-${Date.now()}`},
      ${doc.nombre || 'Sin nombre'},
      ${doc.ubicacion || null},
      ${doc.capacidad || null},
      ${doc.stock_actual || doc.stock || 0},
      ${doc.activo !== false},
      ${created}::timestamp,
      ${updated}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarProveedores(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO proveedores (id, nombre, contacto, email, telefono, direccion, activo, created_at, updated_at)
    VALUES (
      ${doc.id || `PROV-${Date.now()}`},
      ${doc.nombre || 'Sin nombre'},
      ${doc.contacto || null},
      ${doc.email || null},
      ${doc.telefono || null},
      ${doc.direccion || null},
      ${doc.activo !== false},
      ${created}::timestamp,
      ${updated}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarRoles(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO roles (id, nombre, descripcion, permisos, activo, created_at)
    VALUES (
      ${doc.id || `ROL-${Date.now()}`},
      ${doc.nombre || 'Sin nombre'},
      ${doc.descripcion || null},
      ${doc.permisos || []}::text[],
      ${doc.activo !== false},
      ${created}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarEstados(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO estados (id, nombre, tipo, descripcion, color, activo, created_at)
    VALUES (
      ${doc.id || `EST-${Date.now()}`},
      ${doc.nombre || 'Sin nombre'},
      ${doc.tipo || null},
      ${doc.descripcion || null},
      ${doc.color || null},
      ${doc.activo !== false},
      ${created}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarFormaPago(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO forma_pago (id, nombre, descripcion, requiere_autorizacion, activo, created_at)
    VALUES (
      ${doc.id || `FP-${Date.now()}`},
      ${doc.nombre || 'Sin nombre'},
      ${doc.descripcion || null},
      ${doc.requiere_autorizacion || false},
      ${doc.activo !== false},
      ${created}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarUnidadesMedidas(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO unidades_medidas (id, nombre, abreviatura, tipo, activo, created_at)
    VALUES (
      ${doc.id || `UM-${Date.now()}`},
      ${doc.nombre || 'Sin nombre'},
      ${doc.abreviatura || null},
      ${doc.tipo || null},
      ${doc.activo !== false},
      ${created}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarPaises(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO paises (id, nombre, codigo, created_at)
    VALUES (
      ${doc.id || `PAIS-${Date.now()}`},
      ${doc.nombre || 'Sin nombre'},
      ${doc.codigo || null},
      ${created}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarCiudades(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO ciudades (id, nombre, pais_id, codigo_postal, created_at)
    VALUES (
      ${doc.id || `CIU-${Date.now()}`},
      ${doc.nombre || 'Sin nombre'},
      ${doc.pais_id || doc.paisId || null},
      ${doc.codigo_postal || doc.codigoPostal || null},
      ${created}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarUbicaciones(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO ubicaciones (id, nombre, direccion, ciudad_id, tipo, activo, created_at)
    VALUES (
      ${doc.id || `UBI-${Date.now()}`},
      ${doc.nombre || 'Sin nombre'},
      ${doc.direccion || null},
      ${doc.ciudad_id || doc.ciudadId || null},
      ${doc.tipo || null},
      ${doc.activo !== false},
      ${created}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarMovimientos(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO movimientos (id, tipo, producto_id, cantidad, bodega_id, usuario_id, descripcion, fecha, created_at)
    VALUES (
      ${doc.id || `MOV-${Date.now()}`},
      ${doc.tipo || 'ajuste'},
      ${doc.producto_id || doc.productoId || null},
      ${doc.cantidad || 0},
      ${doc.bodega_id || doc.bodegaId || null},
      ${doc.usuario_id || doc.usuarioId || null},
      ${doc.descripcion || null},
      ${doc.fecha ? new Date(doc.fecha) : created}::timestamp,
      ${created}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarOrdenesCompra(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO ordenes_compra (id, proveedor_id, fecha_orden, fecha_entrega, total, estado, items, created_at, updated_at)
    VALUES (
      ${doc.id || `OC-${Date.now()}`},
      ${doc.proveedor_id || doc.proveedorId || null},
      ${doc.fecha_orden ? new Date(doc.fecha_orden) : created}::timestamp,
      ${doc.fecha_entrega ? new Date(doc.fecha_entrega) : null}::timestamp,
      ${parseFloat(doc.total) || 0},
      ${doc.estado || 'pendiente'},
      ${JSON.stringify(doc.items || [])}::jsonb,
      ${created}::timestamp,
      ${updated}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarFacturas(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO facturas (id, pedido_id, cliente_id, numero_factura, fecha_emision, subtotal, impuestos, total, estado, created_at)
    VALUES (
      ${doc.id || `FAC-${Date.now()}`},
      ${doc.pedido_id || doc.pedidoId || null},
      ${doc.cliente_id || doc.clienteId || null},
      ${doc.numero_factura || doc.numeroFactura || null},
      ${doc.fecha_emision ? new Date(doc.fecha_emision) : created}::timestamp,
      ${parseFloat(doc.subtotal) || 0},
      ${parseFloat(doc.impuestos) || 0},
      ${parseFloat(doc.total) || 0},
      ${doc.estado || 'emitida'},
      ${created}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarPagos(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO pagos (id, factura_id, pedido_id, monto, forma_pago_id, fecha_pago, estado, referencia, created_at)
    VALUES (
      ${doc.id || `PAG-${Date.now()}`},
      ${doc.factura_id || doc.facturaId || null},
      ${doc.pedido_id || doc.pedidoId || null},
      ${parseFloat(doc.monto) || 0},
      ${doc.forma_pago_id || doc.formaPagoId || null},
      ${doc.fecha_pago ? new Date(doc.fecha_pago) : created}::timestamp,
      ${doc.estado || 'completado'},
      ${doc.referencia || null},
      ${created}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarEnvios(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO envios (id, pedido_id, direccion, ciudad, codigo_postal, transportista, numero_seguimiento, fecha_envio, fecha_entrega, estado, created_at, updated_at)
    VALUES (
      ${doc.id || `ENV-${Date.now()}`},
      ${doc.pedido_id || doc.pedidoId || null},
      ${doc.direccion || 'Sin dirección'},
      ${doc.ciudad || null},
      ${doc.codigo_postal || doc.codigoPostal || null},
      ${doc.transportista || null},
      ${doc.numero_seguimiento || doc.numeroSeguimiento || null},
      ${doc.fecha_envio ? new Date(doc.fecha_envio) : null}::timestamp,
      ${doc.fecha_entrega ? new Date(doc.fecha_entrega) : null}::timestamp,
      ${doc.estado || 'pendiente'},
      ${created}::timestamp,
      ${updated}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarDescuentos(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO descuentos (id, codigo, descripcion, tipo, valor, porcentaje, fecha_inicio, fecha_fin, activo, created_at)
    VALUES (
      ${doc.id || `DESC-${Date.now()}`},
      ${doc.codigo || null},
      ${doc.descripcion || null},
      ${doc.tipo || null},
      ${parseFloat(doc.valor) || null},
      ${parseFloat(doc.porcentaje) || null},
      ${doc.fecha_inicio ? new Date(doc.fecha_inicio) : null}::timestamp,
      ${doc.fecha_fin ? new Date(doc.fecha_fin) : null}::timestamp,
      ${doc.activo !== false},
      ${created}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarAjustes(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO ajustes (id, clave, valor, tipo, descripcion, categoria, updated_at)
    VALUES (
      ${doc.id || `AJ-${Date.now()}`},
      ${doc.clave || `clave_${Date.now()}`},
      ${doc.valor || null},
      ${doc.tipo || null},
      ${doc.descripcion || null},
      ${doc.categoria || null},
      ${updated}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function migrarBitacora(doc, created, updated) {
  await prisma.$executeRaw`
    INSERT INTO bitacora_operaciones (id, usuario_id, accion, tabla, registro_id, datos_anteriores, datos_nuevos, ip, user_agent, fecha)
    VALUES (
      ${doc.id || `BIT-${Date.now()}`},
      ${doc.usuario_id || doc.usuarioId || null},
      ${doc.accion || 'desconocida'},
      ${doc.tabla || null},
      ${doc.registro_id || doc.registroId || null},
      ${doc.datos_anteriores ? JSON.stringify(doc.datos_anteriores) : null}::jsonb,
      ${doc.datos_nuevos ? JSON.stringify(doc.datos_nuevos) : null}::jsonb,
      ${doc.ip || null},
      ${doc.user_agent || doc.userAgent || null},
      ${doc.fecha ? new Date(doc.fecha) : created}::timestamp
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

distribuirDatos()
  .then(() => {
    console.log('✅ Distribución completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });