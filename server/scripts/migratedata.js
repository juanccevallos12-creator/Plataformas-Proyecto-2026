// server/scripts/migrateDataComplete.js

import { connectDB, closeDB } from '../config/database.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  console.log('\n╔════════════════════════════════════╗');
  console.log('║  🚀 MIGRACIÓN COMPLETA - 24 COLS   ║');
  console.log('╚════════════════════════════════════╝\n');

  try {
    const db = await connectDB();
    let totalMigrados = 0;
    
    // HELPER: Migrar colección desde archivo JSON
    async function migrarColeccion(nombre, archivo = null) {
      try {
        const archivoPath = archivo || path.join(__dirname, `../data/${nombre}.json`);
        const data = JSON.parse(await fs.readFile(archivoPath, 'utf-8'));
        
        if (Array.isArray(data) && data.length > 0) {
          await db.collection(nombre).deleteMany({});
          const result = await db.collection(nombre).insertMany(data);
          console.log(`   ✅ ${result.insertedCount} registros migrados a '${nombre}'`);
          totalMigrados += result.insertedCount;
        } else {
          console.log(`   ⚠️  No hay datos para migrar a '${nombre}'`);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`   ℹ️  Archivo ${nombre}.json no encontrado (se generará con seed)`);
        } else {
          console.error(`   ❌ Error migrando ${nombre}:`, error.message);
        }
      }
    }

    // ============================================================
    //               CORE DEL NEGOCIO (8 colecciones)
    // ============================================================
    console.log('\n📊 CORE DEL NEGOCIO');
    console.log('═══════════════════════════════════\n');
    
    await migrarColeccion('usuarios');
    await migrarColeccion('productos');
    await migrarColeccion('categorias');
    await migrarColeccion('carrito');
    await migrarColeccion('pedidos');
    await migrarColeccion('facturas', path.join(__dirname, '../data/facturacion.json'));
    await migrarColeccion('pagos');
    await migrarColeccion('envios');

    // ============================================================
    //            GESTIÓN DE INVENTARIO (4 colecciones)
    // ============================================================
    console.log('\n📦 GESTIÓN DE INVENTARIO');
    console.log('═══════════════════════════════════\n');
    
    await migrarColeccion('bodega');
    await migrarColeccion('proveedores');
    await migrarColeccion('ordenes_compra');
    await migrarColeccion('movimientos');

    // ============================================================
    //            UBICACIÓN Y ENVÍOS (3 colecciones)
    // ============================================================
    console.log('\n🌍 UBICACIÓN Y ENVÍOS');
    console.log('═══════════════════════════════════\n');
    
    await migrarColeccion('paises');
    await migrarColeccion('ciudades');
    await migrarColeccion('ubicaciones');

    // ============================================================
    //            CLIENTES Y MARKETING (3 colecciones)
    // ============================================================
    console.log('\n👥 CLIENTES Y MARKETING');
    console.log('═══════════════════════════════════\n');
    
    await migrarColeccion('clientes');
    await migrarColeccion('contactos');
    await migrarColeccion('descuentos');

    // ============================================================
    //         CONFIGURACIÓN DEL SISTEMA (4 colecciones)
    // ============================================================
    console.log('\n⚙️  CONFIGURACIÓN DEL SISTEMA');
    console.log('═══════════════════════════════════\n');
    
    await migrarColeccion('roles');
    await migrarColeccion('forma_pago');
    await migrarColeccion('estados');
    await migrarColeccion('unidades_medidas');

    // ============================================================
    //        OPERACIONES Y SEGURIDAD (2 colecciones)
    // ============================================================
    console.log('\n🔒 OPERACIONES Y SEGURIDAD');
    console.log('═══════════════════════════════════\n');
    
    await migrarColeccion('bitacora_operaciones');
    await migrarColeccion('ajustes');

    // ============================================================
    //                    CREAR ÍNDICES
    // ============================================================
    console.log('\n🔍 CREANDO ÍNDICES');
    console.log('═══════════════════════════════════\n');
    
    try {
      // Productos
      await db.collection('productos').createIndex({ nombre: 'text', marca: 'text', categoria: 'text' });
      await db.collection('productos').createIndex({ id: 1 }, { unique: true, sparse: true });
      await db.collection('productos').createIndex({ categoria: 1 });
      console.log('   ✅ Índices de productos creados');
      
      // Usuarios
      await db.collection('usuarios').createIndex({ email: 1 }, { unique: true, sparse: true });
      await db.collection('usuarios').createIndex({ id: 1 }, { unique: true, sparse: true });
      console.log('   ✅ Índices de usuarios creados');
      
      // Pedidos
      await db.collection('pedidos').createIndex({ usuarioId: 1 });
      await db.collection('pedidos').createIndex({ fecha: -1 });
      await db.collection('pedidos').createIndex({ estado: 1 });
      console.log('   ✅ Índices de pedidos creados');
      
      // Clientes
      await db.collection('clientes').createIndex({ usuarioId: 1 }, { unique: true, sparse: true });
      await db.collection('clientes').createIndex({ email: 1 });
      console.log('   ✅ Índices de clientes creados');
      
      // Categorías
      await db.collection('categorias').createIndex({ slug: 1 }, { unique: true, sparse: true });
      console.log('   ✅ Índices de categorías creados');
      
      // Descuentos
      await db.collection('descuentos').createIndex({ codigo: 1 }, { unique: true, sparse: true });
      await db.collection('descuentos').createIndex({ activo: 1, fechaInicio: 1, fechaFin: 1 });
      console.log('   ✅ Índices de descuentos creados');
      
      // Movimientos
      await db.collection('movimientos').createIndex({ productoId: 1, bodegaId: 1 });
      await db.collection('movimientos').createIndex({ fecha: -1 });
      console.log('   ✅ Índices de movimientos creados');
      
      // Bitácora
      await db.collection('bitacora_operaciones').createIndex({ fecha: -1 });
      await db.collection('bitacora_operaciones').createIndex({ usuarioId: 1, fecha: -1 });
      console.log('   ✅ Índices de bitácora creados');
      
      // Ajustes
      await db.collection('ajustes').createIndex({ clave: 1 }, { unique: true });
      console.log('   ✅ Índices de ajustes creados');
      
    } catch (error) {
      console.log('   ℹ️  Algunos índices ya existen (esto es normal)');
    }
    
    // ============================================================
    //                    VERIFICACIÓN
    // ============================================================
    console.log('\n📋 VERIFICANDO COLECCIONES');
    console.log('═══════════════════════════════════\n');
    
    const colecciones = await db.listCollections().toArray();
    const coleccionesCreadas = colecciones.map(c => c.name).sort();
    
    const coleccionesEsperadas = [
      'ajustes',
      'bitacora_operaciones',
      'bodega',
      'carrito',
      'categorias',
      'ciudades',
      'clientes',
      'contactos',
      'descuentos',
      'envios',
      'estados',
      'forma_pago',
      'movimientos',
      'ordenes_compra',
      'pagos',
      'paises',
      'pedidos',
      'productos',
      'proveedores',
      'roles',
      'ubicaciones',
      'unidades_medidas',
      'usuarios'
      // facturas se cuenta como una de las 24
    ];
    
    console.log('Colecciones creadas:');
    coleccionesCreadas.forEach(col => {
      const esperada = coleccionesEsperadas.includes(col);
      console.log(`   ${esperada ? '✅' : 'ℹ️ '} ${col}`);
    });
    
    const faltantes = coleccionesEsperadas.filter(c => !coleccionesCreadas.includes(c));
    if (faltantes.length > 0) {
      console.log('\n⚠️  Colecciones faltantes (se crearán con seed):');
      faltantes.forEach(col => console.log(`   • ${col}`));
    }
    
    // ============================================================
    //                    RESUMEN
    // ============================================================
    console.log('\n╔════════════════════════════════════╗');
    console.log('║  ✅ MIGRACIÓN COMPLETADA           ║');
    console.log('╠════════════════════════════════════╣');
    console.log(`║  Total documentos: ${totalMigrados.toString().padEnd(15)} ║`);
    console.log(`║  Colecciones: ${coleccionesCreadas.length}/${coleccionesEsperadas.length}                 ║`);
    console.log('╚════════════════════════════════════╝\n');
    
    console.log('🎯 PRÓXIMOS PASOS:');
    console.log('   1. Ejecuta: node server/scripts/seedData.js');
    console.log('      (Para generar data de configuración)');
    console.log('   2. Inicia el servidor: node server.js\n');
    
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error);
    console.error('\n🔍 Verifica:');
    console.error('   - Archivo .env existe con MONGODB_URI');
    console.error('   - IP autorizada en MongoDB Atlas');
    console.error('   - Credenciales correctas\n');
    process.exit(1);
  } finally {
    await closeDB();
  }
}

// Ejecutar migración
migrate().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});