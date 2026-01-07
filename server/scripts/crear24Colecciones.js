// server/scripts/crear24Colecciones.js
// ============================================================
//    CREAR LAS 24 COLECCIONES COMPLETAS
//    Genera todas las colecciones requeridas para la evaluación
// ============================================================

import { connectDB, closeDB } from '../config/database.js';

async function crear24Colecciones() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  📦 CREANDO 24 COLECCIONES COMPLETAS       ║');
  console.log('╚════════════════════════════════════════════╝\n');

  try {
    const db = await connectDB();
    let coleccionesCreadas = 0;

    // ============================================================
    //    COLECCIONES QUE YA EXISTEN (solo verificar)
    // ============================================================
    const coleccionesExistentes = [
      'usuarios', 'productos', 'categorias', 'pedidos',
      'roles', 'estados', 'forma_pago', 'unidades_medidas',
      'paises', 'ciudades', 'proveedores', 'bodega', 'ajustes'
    ];

    console.log('✅ Colecciones existentes (se mantienen):');
    for (const col of coleccionesExistentes) {
      const count = await db.collection(col).countDocuments();
      console.log(`   ✓ ${col.padEnd(25)} (${count} docs)`);
    }

    // ============================================================
    //    CREAR COLECCIONES FALTANTES
    // ============================================================
    console.log('\n📦 Creando colecciones faltantes:\n');

    // 1. CARRITO
    const carritoExiste = await db.collection('carrito').countDocuments();
    if (carritoExiste === 0) {
      await db.collection('carrito').insertOne({
        id: 'CART-DEMO-001',
        usuarioId: 'USR-001',
        items: [
          {
            productoId: 'PROD-001',
            nombre: 'Producto Demo',
            cantidad: 1,
            precio: 100,
            subtotal: 100
          }
        ],
        total: 100,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        activo: true
      });
      console.log('   ✅ carrito (1 doc de ejemplo)');
      coleccionesCreadas++;
    } else {
      console.log('   ✓ carrito (ya existe)');
    }

    // 2. FACTURAS
    const facturasExiste = await db.collection('facturas').countDocuments();
    if (facturasExiste === 0) {
      await db.collection('facturas').insertOne({
        id: 'FACT-001',
        numero: '001-001-000000001',
        pedidoId: 'PED-001',
        clienteId: 'CLI-001',
        fecha: new Date(),
        subtotal: 100,
        iva: 15,
        total: 115,
        formaPago: 'efectivo',
        estado: 'emitida',
        autorizacion: 'AUTO-2024-001',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('   ✅ facturas (1 doc de ejemplo)');
      coleccionesCreadas++;
    } else {
      console.log('   ✓ facturas (ya existe)');
    }

    // 3. PAGOS
    const pagosExiste = await db.collection('pagos').countDocuments();
    if (pagosExiste === 0) {
      await db.collection('pagos').insertOne({
        id: 'PAG-001',
        pedidoId: 'PED-001',
        facturaId: 'FACT-001',
        monto: 115,
        formaPago: 'tarjeta',
        estado: 'aprobado',
        referencia: 'REF-2024-001',
        fechaPago: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('   ✅ pagos (1 doc de ejemplo)');
      coleccionesCreadas++;
    } else {
      console.log('   ✓ pagos (ya existe)');
    }

    // 4. ENVIOS
    const enviosExiste = await db.collection('envios').countDocuments();
    if (enviosExiste === 0) {
      await db.collection('envios').insertOne({
        id: 'ENV-001',
        pedidoId: 'PED-001',
        direccion: {
          calle: 'Av. Principal 123',
          ciudad: 'Quito',
          provincia: 'Pichincha',
          codigoPostal: '170101'
        },
        estado: 'en_transito',
        trackingNumber: 'TRACK-2024-001',
        courier: 'Servientrega',
        costoEnvio: 5,
        fechaEnvio: new Date(),
        fechaEstimadaEntrega: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('   ✅ envios (1 doc de ejemplo)');
      coleccionesCreadas++;
    } else {
      console.log('   ✓ envios (ya existe)');
    }

    // 5. CLIENTES
    const clientesExiste = await db.collection('clientes').countDocuments();
    if (clientesExiste === 0) {
      await db.collection('clientes').insertOne({
        id: 'CLI-001',
        usuarioId: 'USR-001',
        tipoDocumento: 'cedula',
        numeroDocumento: '1234567890',
        telefono: '+593987654321',
        direccion: {
          principal: 'Av. Principal 123',
          ciudad: 'Quito',
          provincia: 'Pichincha'
        },
        estadisticas: {
          totalCompras: 1,
          montoTotal: 115,
          promedioCompra: 115
        },
        preferencias: {
          notificaciones: true,
          newsletter: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('   ✅ clientes (1 doc de ejemplo)');
      coleccionesCreadas++;
    } else {
      console.log('   ✓ clientes (ya existe)');
    }

    // 6. CONTACTOS
    const contactosExiste = await db.collection('contactos').countDocuments();
    if (contactosExiste === 0) {
      await db.collection('contactos').insertOne({
        id: 'CONT-001',
        nombre: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        telefono: '+593987654321',
        asunto: 'Consulta general',
        mensaje: 'Mensaje de ejemplo',
        estado: 'pendiente',
        fechaContacto: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('   ✅ contactos (1 doc de ejemplo)');
      coleccionesCreadas++;
    } else {
      console.log('   ✓ contactos (ya existe)');
    }

    // 7. DESCUENTOS
    const descuentosExiste = await db.collection('descuentos').countDocuments();
    if (descuentosExiste === 0) {
      await db.collection('descuentos').insertOne({
        id: 'DESC-001',
        codigo: 'PROMO10',
        descripcion: 'Descuento del 10% en primera compra',
        tipo: 'porcentaje',
        valor: 10,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usoMaximo: 100,
        usoActual: 0,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('   ✅ descuentos (1 doc de ejemplo)');
      coleccionesCreadas++;
    } else {
      console.log('   ✓ descuentos (ya existe)');
    }

    // 8. UBICACIONES
    const ubicacionesExiste = await db.collection('ubicaciones').countDocuments();
    if (ubicacionesExiste === 0) {
      await db.collection('ubicaciones').insertOne({
        id: 'UBI-001',
        clienteId: 'CLI-001',
        tipo: 'entrega',
        nombre: 'Casa',
        direccion: 'Av. Principal 123',
        ciudad: 'Quito',
        provincia: 'Pichincha',
        codigoPostal: '170101',
        referencia: 'Edificio azul, tercer piso',
        predeterminada: true,
        activa: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('   ✅ ubicaciones (1 doc de ejemplo)');
      coleccionesCreadas++;
    } else {
      console.log('   ✓ ubicaciones (ya existe)');
    }

    // 9. ORDENES_COMPRA
    const ordenesExiste = await db.collection('ordenes_compra').countDocuments();
    if (ordenesExiste === 0) {
      await db.collection('ordenes_compra').insertOne({
        id: 'OC-001',
        numero: 'OC-2024-001',
        proveedorId: 'PROV-1',
        fecha: new Date(),
        items: [
          {
            productoId: 'PROD-001',
            cantidad: 50,
            precioUnitario: 80,
            subtotal: 4000
          }
        ],
        subtotal: 4000,
        iva: 600,
        total: 4600,
        estado: 'pendiente',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('   ✅ ordenes_compra (1 doc de ejemplo)');
      coleccionesCreadas++;
    } else {
      console.log('   ✓ ordenes_compra (ya existe)');
    }

    // 10. MOVIMIENTOS
    const movimientosExiste = await db.collection('movimientos').countDocuments();
    if (movimientosExiste === 0) {
      await db.collection('movimientos').insertOne({
        id: 'MOV-001',
        tipo: 'entrada',
        bodegaId: 'BOD-1',
        productoId: 'PROD-001',
        cantidad: 50,
        motivo: 'Compra a proveedor',
        referencia: 'OC-001',
        responsable: 'admin',
        fecha: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('   ✅ movimientos (1 doc de ejemplo)');
      coleccionesCreadas++;
    } else {
      console.log('   ✓ movimientos (ya existe)');
    }

    // 11. BITACORA_OPERACIONES
    const bitacoraExiste = await db.collection('bitacora_operaciones').countDocuments();
    if (bitacoraExiste === 0) {
      await db.collection('bitacora_operaciones').insertOne({
        id: 'BIT-001',
        tipo: 'sistema',
        accion: 'inicializacion',
        usuario: 'sistema',
        descripcion: 'Sistema inicializado con 24 colecciones',
        fecha: new Date(),
        ip: '127.0.0.1',
        datosAdicionales: {
          colecciones: 24,
          version: '1.0.0'
        },
        createdAt: new Date()
      });
      console.log('   ✅ bitacora_operaciones (1 doc de ejemplo)');
      coleccionesCreadas++;
    } else {
      console.log('   ✓ bitacora_operaciones (ya existe)');
    }

    // ============================================================
    //    VERIFICACIÓN FINAL
    // ============================================================
    console.log('\n📊 VERIFICACIÓN FINAL:');
    console.log('═══════════════════════════════════════════\n');

    const todasLasColecciones = await db.listCollections().toArray();
    const nombresColecciones = todasLasColecciones.map(c => c.name).sort();

    console.log('Lista completa de colecciones:\n');
    let contador = 0;
    for (const nombre of nombresColecciones) {
      contador++;
      const count = await db.collection(nombre).countDocuments();
      const icono = count > 0 ? '✅' : '○';
      console.log(`   ${contador.toString().padStart(2)}. ${icono} ${nombre.padEnd(25)} (${count} docs)`);
    }

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  ✅ PROCESO COMPLETADO                     ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║  Total colecciones: ${nombresColecciones.length.toString().padEnd(20)} ║`);
    console.log(`║  Nuevas creadas: ${coleccionesCreadas.toString().padEnd(23)} ║`);
    console.log('╠════════════════════════════════════════════╣');
    if (nombresColecciones.length >= 24) {
      console.log('║  🎯 OBJETIVO CUMPLIDO: 24+ colecciones     ║');
    } else {
      console.log(`║  ⚠️  Faltan ${(24 - nombresColecciones.length)} colecciones                      ║`);
    }
    console.log('╚════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ Error creando colecciones:', error);
    process.exit(1);
  } finally {
    await closeDB();
  }
}

// Ejecutar
crear24Colecciones().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
