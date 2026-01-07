// server/scripts/seedData.js

import { connectDB, closeDB } from '../config/database.js';

async function seedDatabase() {
  console.log('\n╔════════════════════════════════════╗');
  console.log('║  🌱 GENERANDO DATA DE PRUEBA       ║');
  console.log('╚════════════════════════════════════╝\n');

  try {
    const db = await connectDB();
    
    // ⚠️ IMPORTANTE: NO TOCAR productos, usuarios, pedidos, contactos
    // Esas colecciones ya tienen data del usuario
    
    console.log('ℹ️  Nota: NO se modificarán las siguientes colecciones:');
    console.log('   - productos (ya tienes tus productos)');
    console.log('   - usuarios (ya tienes tus usuarios)');
    console.log('   - pedidos (ya tienes tus pedidos)');
    console.log('   - contactos (ya tienes tus contactos)\n');
    
    // ============================================================
    //                    1. ROLES
    // ============================================================
    console.log('👥 Creando roles...');
    await db.collection('roles').deleteMany({});
    const roles = [
      {
        id: 'ROL-ADMIN',
        nombre: 'Administrador',
        descripcion: 'Acceso total al sistema',
        permisos: ['crear', 'leer', 'actualizar', 'eliminar', 'configurar'],
        nivel: 10,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'ROL-VENDEDOR',
        nombre: 'Vendedor',
        descripcion: 'Gestión de ventas y productos',
        permisos: ['crear', 'leer', 'actualizar'],
        nivel: 5,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'ROL-CLIENTE',
        nombre: 'Cliente',
        descripcion: 'Usuario comprador',
        permisos: ['leer', 'comprar'],
        nivel: 1,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await db.collection('roles').insertMany(roles);
    console.log(`   ✅ ${roles.length} roles creados`);

    // ============================================================
    //                    2. ESTADOS
    // ============================================================
    console.log('\n📊 Creando estados...');
    await db.collection('estados').deleteMany({});
    const estados = [
      // Estados de pedidos
      { id: 'EST-PED-PEND', nombre: 'Pendiente', descripcion: 'Pedido recibido, pendiente de confirmar', tipo: 'pedido', codigo: 'PENDIENTE', color: '#FFA500', orden: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-PED-CONF', nombre: 'Confirmado', descripcion: 'Pedido confirmado por el vendedor', tipo: 'pedido', codigo: 'CONFIRMADO', color: '#4CAF50', orden: 2, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-PED-PROC', nombre: 'Procesando', descripcion: 'Pedido en proceso de preparación', tipo: 'pedido', codigo: 'PROCESANDO', color: '#2196F3', orden: 3, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-PED-ENV', nombre: 'Enviado', descripcion: 'Pedido enviado al cliente', tipo: 'pedido', codigo: 'ENVIADO', color: '#9C27B0', orden: 4, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-PED-ENT', nombre: 'Entregado', descripcion: 'Pedido entregado al cliente', tipo: 'pedido', codigo: 'ENTREGADO', color: '#4CAF50', orden: 5, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-PED-CANC', nombre: 'Cancelado', descripcion: 'Pedido cancelado', tipo: 'pedido', codigo: 'CANCELADO', color: '#F44336', orden: 6, activo: true, createdAt: new Date(), updatedAt: new Date() },
      // Estados de pago
      { id: 'EST-PAG-PEND', nombre: 'Pendiente', descripcion: 'Pago pendiente de procesamiento', tipo: 'pago', codigo: 'PENDIENTE', color: '#FFA500', orden: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-PAG-APRO', nombre: 'Aprobado', descripcion: 'Pago aprobado y procesado', tipo: 'pago', codigo: 'APROBADO', color: '#4CAF50', orden: 2, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-PAG-RECH', nombre: 'Rechazado', descripcion: 'Pago rechazado', tipo: 'pago', codigo: 'RECHAZADO', color: '#F44336', orden: 3, activo: true, createdAt: new Date(), updatedAt: new Date() },
      // Estados de envío
      { id: 'EST-ENV-PREP', nombre: 'En preparación', descripcion: 'Envío en preparación', tipo: 'envio', codigo: 'PREPARACION', color: '#FFA500', orden: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-ENV-TRAN', nombre: 'En tránsito', descripcion: 'Envío en camino al destino', tipo: 'envio', codigo: 'TRANSITO', color: '#2196F3', orden: 2, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-ENV-ENT', nombre: 'Entregado', descripcion: 'Envío entregado al destinatario', tipo: 'envio', codigo: 'ENTREGADO', color: '#4CAF50', orden: 3, activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('estados').insertMany(estados);
    console.log(`   ✅ ${estados.length} estados creados`);

    // ============================================================
    //                    3. FORMAS DE PAGO
    // ============================================================
    console.log('\n💳 Creando formas de pago...');
    await db.collection('forma_pago').deleteMany({});
    const formasPago = [
      { id: 'FP-EFECTIVO', nombre: 'Efectivo', descripcion: 'Pago en efectivo contra entrega', tipo: 'efectivo', comision: 0, diasProceso: 0, requiereValidacion: false, orden: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'FP-TARJETA', nombre: 'Tarjeta Crédito/Débito', descripcion: 'Pago con tarjeta bancaria', tipo: 'tarjeta', comision: 3.5, diasProceso: 1, requiereValidacion: true, orden: 2, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'FP-TRANSFERENCIA', nombre: 'Transferencia Bancaria', descripcion: 'Transferencia a cuenta bancaria', tipo: 'transferencia', comision: 0, diasProceso: 2, requiereValidacion: true, orden: 3, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'FP-PAYPAL', nombre: 'PayPal', descripcion: 'Pago mediante PayPal', tipo: 'wallet', comision: 4.5, diasProceso: 0, requiereValidacion: false, orden: 4, activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('forma_pago').insertMany(formasPago);
    console.log(`   ✅ ${formasPago.length} formas de pago creadas`);

    // ============================================================
    //                    4. UNIDADES DE MEDIDA
    // ============================================================
    console.log('\n📏 Creando unidades de medida...');
    await db.collection('unidades_medidas').deleteMany({});
    const unidadesMedida = [
      { id: 'UM-UNIDAD', nombre: 'Unidad', simbolo: 'u', tipo: 'unidad', factorConversion: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'UM-KG', nombre: 'Kilogramo', simbolo: 'kg', tipo: 'peso', factorConversion: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'UM-G', nombre: 'Gramo', simbolo: 'g', tipo: 'peso', factorConversion: 0.001, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'UM-L', nombre: 'Litro', simbolo: 'L', tipo: 'volumen', factorConversion: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'UM-ML', nombre: 'Mililitro', simbolo: 'ml', tipo: 'volumen', factorConversion: 0.001, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'UM-M', nombre: 'Metro', simbolo: 'm', tipo: 'longitud', factorConversion: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'UM-CM', nombre: 'Centímetro', simbolo: 'cm', tipo: 'longitud', factorConversion: 0.01, activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('unidades_medidas').insertMany(unidadesMedida);
    console.log(`   ✅ ${unidadesMedida.length} unidades de medida creadas`);

    // ============================================================
    //                    5. PAÍSES Y CIUDADES
    // ============================================================
    console.log('\n🌍 Creando países y ciudades...');
    await db.collection('paises').deleteMany({});
    await db.collection('ciudades').deleteMany({});
    
    const paises = [
      { id: 'PAIS-EC', nombre: 'Ecuador', codigo: 'EC', codigoISO3: 'ECU', continente: 'América del Sur', prefijoPais: '+593', moneda: 'USD', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'PAIS-CO', nombre: 'Colombia', codigo: 'CO', codigoISO3: 'COL', continente: 'América del Sur', prefijoPais: '+57', moneda: 'COP', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'PAIS-PE', nombre: 'Perú', codigo: 'PE', codigoISO3: 'PER', continente: 'América del Sur', prefijoPais: '+51', moneda: 'PEN', activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('paises').insertMany(paises);
    
    const ciudades = [
      { id: 'CIU-QUITO', nombre: 'Quito', paisId: 'PAIS-EC', codigoPostal: '170101', latitud: -0.1807, longitud: -78.4678, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'CIU-GYE', nombre: 'Guayaquil', paisId: 'PAIS-EC', codigoPostal: '090101', latitud: -2.1894, longitud: -79.8849, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'CIU-CUE', nombre: 'Cuenca', paisId: 'PAIS-EC', codigoPostal: '010101', latitud: -2.9001, longitud: -79.0059, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'CIU-BOG', nombre: 'Bogotá', paisId: 'PAIS-CO', codigoPostal: '110111', latitud: 4.7110, longitud: -74.0721, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'CIU-LIM', nombre: 'Lima', paisId: 'PAIS-PE', codigoPostal: '15001', latitud: -12.0464, longitud: -77.0428, activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('ciudades').insertMany(ciudades);
    console.log(`   ✅ ${paises.length} países y ${ciudades.length} ciudades creadas`);

    // ============================================================
    //                    6. CATEGORÍAS (OPCIONAL - basadas en tus productos)
    // ============================================================
    console.log('\n📦 Creando categorías básicas...');
    await db.collection('categorias').deleteMany({});
    const categorias = [
      { id: 'CAT-ELEC', nombre: 'Electrónica', descripcion: 'Productos electrónicos y tecnológicos', slug: 'electronica', imagen: null, icono: null, orden: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'CAT-COMP', nombre: 'Computación', descripcion: 'Computadoras y accesorios', slug: 'computacion', imagen: null, icono: null, orden: 2, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'CAT-TELEF', nombre: 'Telefonía', descripcion: 'Smartphones y accesorios', slug: 'telefonia', imagen: null, icono: null, orden: 3, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'CAT-HOGAR', nombre: 'Hogar', descripcion: 'Productos para el hogar', slug: 'hogar', imagen: null, icono: null, orden: 4, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'CAT-DEPORT', nombre: 'Deportes', descripcion: 'Artículos deportivos', slug: 'deportes', imagen: null, icono: null, orden: 5, activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('categorias').insertMany(categorias);
    console.log(`   ✅ ${categorias.length} categorías creadas`);

    // ============================================================
    //                    7. PROVEEDORES
    // ============================================================
    console.log('\n🏢 Creando proveedores...');
    await db.collection('proveedores').deleteMany({});
    const proveedores = [
      {
        id: 'PROV-TECH',
        nombre: 'Tech Supplies SA',
        razonSocial: 'Tech Supplies Sociedad Anónima',
        ruc: '1792345678001',
        email: 'ventas@techsupplies.ec',
        telefono: '+593987654321',
        direccion: 'Av. República 123',
        pais: 'Ecuador',
        ciudad: 'Quito',
        contacto: { nombre: 'Juan Pérez', cargo: 'Gerente Comercial', telefono: '+593987654321', email: 'jperez@techsupplies.ec' },
        condicionesPago: { plazo: 30, descuento: 2, metodoPago: 'transferencia' },
        productos: [],
        calificacion: { puntaje: 4.5, entregas: 0, calidad: 0 },
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'PROV-GLOBAL',
        nombre: 'Global Electronics',
        razonSocial: 'Global Electronics Ecuador Cía. Ltda.',
        ruc: '1723456789001',
        email: 'info@globalelec.com',
        telefono: '+593998765432',
        direccion: 'Calle Los Shyris 456',
        pais: 'Ecuador',
        ciudad: 'Quito',
        contacto: { nombre: 'María González', cargo: 'Jefa de Ventas', telefono: '+593998765432', email: 'mgonzalez@globalelec.com' },
        condicionesPago: { plazo: 45, descuento: 5, metodoPago: 'transferencia' },
        productos: [],
        calificacion: { puntaje: 4.8, entregas: 0, calidad: 0 },
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await db.collection('proveedores').insertMany(proveedores);
    console.log(`   ✅ ${proveedores.length} proveedores creados`);

    // ============================================================
    //                    8. BODEGAS
    // ============================================================
    console.log('\n🏭 Creando bodegas...');
    await db.collection('bodega').deleteMany({});
    const bodegas = [
      {
        id: 'BOD-PRINCIPAL',
        nombre: 'Bodega Principal Quito',
        codigo: 'BOD-QTO-001',
        ubicacion: { pais: 'Ecuador', ciudad: 'Quito', direccion: 'Parque Industrial Itulcachi Lote 15', coordenadas: null },
        capacidad: { maxProductos: 50000, areaM2: 1200, ocupacionActual: 0 },
        responsable: { nombre: 'Carlos Morales', telefono: '+593987654123', email: 'cmorales@empresa.com' },
        tipo: 'principal',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'BOD-SECUNDARIA',
        nombre: 'Bodega Guayaquil',
        codigo: 'BOD-GYE-001',
        ubicacion: { pais: 'Ecuador', ciudad: 'Guayaquil', direccion: 'Zona Industrial Km 8.5', coordenadas: null },
        capacidad: { maxProductos: 30000, areaM2: 800, ocupacionActual: 0 },
        responsable: { nombre: 'Ana Torres', telefono: '+593991234567', email: 'atorres@empresa.com' },
        tipo: 'secundaria',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await db.collection('bodega').insertMany(bodegas);
    console.log(`   ✅ ${bodegas.length} bodegas creadas`);

    // ============================================================
    //                    9. AJUSTES DEL SISTEMA
    // ============================================================
    console.log('\n⚙️  Creando ajustes del sistema...');
    await db.collection('ajustes').deleteMany({});
    const ajustes = [
      { id: 'AJ-NOMBRE', clave: 'nombre_tienda', valor: 'TechStore Ecuador', categoria: 'general', tipo: 'string', descripcion: 'Nombre de la tienda', publico: true, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'AJ-EMAIL', clave: 'email_contacto', valor: 'contacto@techstore.ec', categoria: 'general', tipo: 'string', descripcion: 'Email de contacto', publico: true, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'AJ-TELEFONO', clave: 'telefono_contacto', valor: '+593987654321', categoria: 'general', tipo: 'string', descripcion: 'Teléfono de contacto', publico: true, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'AJ-MONEDA', clave: 'moneda', valor: 'USD', categoria: 'ecommerce', tipo: 'string', descripcion: 'Moneda predeterminada', publico: true, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'AJ-IVA', clave: 'iva_porcentaje', valor: '15', categoria: 'ecommerce', tipo: 'number', descripcion: 'Porcentaje de IVA', publico: true, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'AJ-ENVIO', clave: 'costo_envio_base', valor: '5.00', categoria: 'envios', tipo: 'number', descripcion: 'Costo base de envío', publico: true, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'AJ-MINIMO', clave: 'compra_minima', valor: '10.00', categoria: 'ecommerce', tipo: 'number', descripcion: 'Monto mínimo de compra', publico: true, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'AJ-ENVIO-GRATIS', clave: 'envio_gratis_desde', valor: '50.00', categoria: 'envios', tipo: 'number', descripcion: 'Monto para envío gratis', publico: true, activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('ajustes').insertMany(ajustes);
    console.log(`   ✅ ${ajustes.length} ajustes creados`);

    // ============================================================
    //                    RESUMEN
    // ============================================================
    const totalGenerado = roles.length + estados.length + formasPago.length + 
                         unidadesMedida.length + paises.length + ciudades.length +
                         categorias.length + proveedores.length + bodegas.length + ajustes.length;

    console.log('\n╔════════════════════════════════════╗');
    console.log('║  ✅ SEED DATA COMPLETADO           ║');
    console.log('╠════════════════════════════════════╣');
    console.log(`║  Roles: ${roles.length}                       ║`);
    console.log(`║  Estados: ${estados.length}                   ║`);
    console.log(`║  Formas de pago: ${formasPago.length}              ║`);
    console.log(`║  Unidades medida: ${unidadesMedida.length}             ║`);
    console.log(`║  Países: ${paises.length}                      ║`);
    console.log(`║  Ciudades: ${ciudades.length}                    ║`);
    console.log(`║  Categorías: ${categorias.length}                  ║`);
    console.log(`║  Proveedores: ${proveedores.length}                 ║`);
    console.log(`║  Bodegas: ${bodegas.length}                     ║`);
    console.log(`║  Ajustes: ${ajustes.length}                     ║`);
    console.log('╠════════════════════════════════════╣');
    console.log(`║  Total: ${totalGenerado} documentos generados  ║`);
    console.log('╚════════════════════════════════════╝\n');
    
    console.log('ℹ️  Colecciones NO modificadas (conservan tu data):');
    console.log('   ✓ productos');
    console.log('   ✓ usuarios');
    console.log('   ✓ pedidos');
    console.log('   ✓ contactos\n');

  } catch (error) {
    console.error('\n❌ Error generando seed data:', error);
    process.exit(1);
  } finally {
    await closeDB();
  }
}

// Ejecutar seed
seedData base().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});