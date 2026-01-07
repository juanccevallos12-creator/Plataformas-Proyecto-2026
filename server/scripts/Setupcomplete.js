// server/scripts/setupComplete.js
// ============================================================
//    SCRIPT TODO-EN-UNO: MIGRACIÓN + SEED DATA
//    Ejecuta la configuración completa de las 24 colecciones
//    ⚠️ MODIFICADO: NO toca la colección de productos
// ============================================================

import { connectDB, closeDB } from '../config/database.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setupComplete() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  🚀 CONFIGURACIÓN COMPLETA DEL SISTEMA     ║');
  console.log('║     Migración + Seed Data Automático      ║');
  console.log('╚════════════════════════════════════════════╝\n');

  try {
    const db = await connectDB();
    let totalDocumentos = 0;

    // ============================================================
    //                PASO 1: MIGRAR DATOS EXISTENTES
    // ============================================================
    console.log('📦 PASO 1: MIGRANDO DATOS EXISTENTES');
    console.log('═══════════════════════════════════════════\n');
    
    console.log('⚠️  IMPORTANTE: La colección PRODUCTOS no será modificada');
    console.log('   (conservarás tus productos existentes)\n');
    
    // Solo migrar usuarios, pedidos y contactos (NO productos)
    const coleccionesConDatos = ['usuarios', 'pedidos', 'contactos'];
    
    for (const coleccion of coleccionesConDatos) {
      try {
        const archivoPath = path.join(__dirname, `../data/${coleccion}.json`);
        const data = JSON.parse(await fs.readFile(archivoPath, 'utf-8'));
        
        if (Array.isArray(data) && data.length > 0) {
          await db.collection(coleccion).deleteMany({});
          const result = await db.collection(coleccion).insertMany(data);
          console.log(`   ✅ ${coleccion}: ${result.insertedCount} documentos`);
          totalDocumentos += result.insertedCount;
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`   ℹ️  ${coleccion}: Sin archivo JSON (se creará vacío)`);
        } else {
          console.log(`   ⚠️  ${coleccion}: Error - ${error.message}`);
        }
      }
    }
    
    // Verificar si productos ya existe
    const productosCount = await db.collection('productos').countDocuments();
    console.log(`   ✓ productos: ${productosCount} documentos (NO modificados)`);

    // ============================================================
    //                PASO 2: SEED DATA DE CONFIGURACIÓN
    // ============================================================
    console.log('\n🌱 PASO 2: GENERANDO DATA DE CONFIGURACIÓN');
    console.log('═══════════════════════════════════════════\n');

    // ROLES
    await db.collection('roles').deleteMany({});
    const roles = [
      { id: 'ROL-ADMIN', nombre: 'Administrador', descripcion: 'Acceso total', permisos: ['crear', 'leer', 'actualizar', 'eliminar', 'configurar'], nivel: 10, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'ROL-VENDEDOR', nombre: 'Vendedor', descripcion: 'Gestión de ventas', permisos: ['crear', 'leer', 'actualizar'], nivel: 5, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'ROL-CLIENTE', nombre: 'Cliente', descripcion: 'Usuario comprador', permisos: ['leer', 'comprar'], nivel: 1, activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('roles').insertMany(roles);
    totalDocumentos += roles.length;
    console.log(`   ✅ Roles: ${roles.length}`);

    // ESTADOS
    await db.collection('estados').deleteMany({});
    const estados = [
      { id: 'EST-PED-PEND', nombre: 'Pendiente', tipo: 'pedido', codigo: 'PENDIENTE', color: '#FFA500', orden: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-PED-CONF', nombre: 'Confirmado', tipo: 'pedido', codigo: 'CONFIRMADO', color: '#4CAF50', orden: 2, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-PED-ENV', nombre: 'Enviado', tipo: 'pedido', codigo: 'ENVIADO', color: '#2196F3', orden: 3, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-PED-ENT', nombre: 'Entregado', tipo: 'pedido', codigo: 'ENTREGADO', color: '#4CAF50', orden: 4, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-PAG-PEND', nombre: 'Pendiente', tipo: 'pago', codigo: 'PENDIENTE', color: '#FFA500', orden: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'EST-PAG-APRO', nombre: 'Aprobado', tipo: 'pago', codigo: 'APROBADO', color: '#4CAF50', orden: 2, activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('estados').insertMany(estados);
    totalDocumentos += estados.length;
    console.log(`   ✅ Estados: ${estados.length}`);

    // FORMAS DE PAGO
    await db.collection('forma_pago').deleteMany({});
    const formasPago = [
      { id: 'FP-EFECTIVO', nombre: 'Efectivo', tipo: 'efectivo', comision: 0, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'FP-TARJETA', nombre: 'Tarjeta', tipo: 'tarjeta', comision: 3.5, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'FP-TRANSFERENCIA', nombre: 'Transferencia', tipo: 'transferencia', comision: 0, activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('forma_pago').insertMany(formasPago);
    totalDocumentos += formasPago.length;
    console.log(`   ✅ Formas de pago: ${formasPago.length}`);

    // UNIDADES DE MEDIDA
    await db.collection('unidades_medidas').deleteMany({});
    const unidadesMedida = [
      { id: 'UM-UNIDAD', nombre: 'Unidad', simbolo: 'u', tipo: 'unidad', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'UM-KG', nombre: 'Kilogramo', simbolo: 'kg', tipo: 'peso', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'UM-L', nombre: 'Litro', simbolo: 'L', tipo: 'volumen', activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('unidades_medidas').insertMany(unidadesMedida);
    totalDocumentos += unidadesMedida.length;
    console.log(`   ✅ Unidades de medida: ${unidadesMedida.length}`);

    // CATEGORÍAS
    await db.collection('categorias').deleteMany({});
    const categorias = [
      { id: 'CAT-ELEC', nombre: 'Electrónica', slug: 'electronica', orden: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'CAT-COMP', nombre: 'Computación', slug: 'computacion', orden: 2, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'CAT-TELEF', nombre: 'Telefonía', slug: 'telefonia', orden: 3, activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('categorias').insertMany(categorias);
    totalDocumentos += categorias.length;
    console.log(`   ✅ Categorías: ${categorias.length}`);

    // PAÍSES Y CIUDADES
    await db.collection('paises').deleteMany({});
    const paises = [
      { id: 'PAIS-EC', nombre: 'Ecuador', codigo: 'EC', activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('paises').insertMany(paises);
    totalDocumentos += paises.length;
    
    await db.collection('ciudades').deleteMany({});
    const ciudades = [
      { id: 'CIU-QUITO', nombre: 'Quito', paisId: 'PAIS-EC', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'CIU-GYE', nombre: 'Guayaquil', paisId: 'PAIS-EC', activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('ciudades').insertMany(ciudades);
    totalDocumentos += ciudades.length;
    console.log(`   ✅ Países: ${paises.length}, Ciudades: ${ciudades.length}`);

    // PROVEEDORES
    await db.collection('proveedores').deleteMany({});
    const proveedores = [
      { id: 'PROV-1', nombre: 'Proveedor Principal', email: 'prov1@mail.com', activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('proveedores').insertMany(proveedores);
    totalDocumentos += proveedores.length;
    console.log(`   ✅ Proveedores: ${proveedores.length}`);

    // BODEGAS
    await db.collection('bodega').deleteMany({});
    const bodegas = [
      { id: 'BOD-1', nombre: 'Bodega Principal', codigo: 'BOD-001', activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('bodega').insertMany(bodegas);
    totalDocumentos += bodegas.length;
    console.log(`   ✅ Bodegas: ${bodegas.length}`);

    // AJUSTES
    await db.collection('ajustes').deleteMany({});
    const ajustes = [
      { id: 'AJ-NOMBRE', clave: 'nombre_tienda', valor: 'TechStore Ecuador', categoria: 'general', publico: true, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'AJ-MONEDA', clave: 'moneda', valor: 'USD', categoria: 'ecommerce', publico: true, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'AJ-IVA', clave: 'iva_porcentaje', valor: '15', categoria: 'ecommerce', publico: true, activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    await db.collection('ajustes').insertMany(ajustes);
    totalDocumentos += ajustes.length;
    console.log(`   ✅ Ajustes: ${ajustes.length}`);

    // ============================================================
    //                PASO 3: CREAR ÍNDICES
    // ============================================================
    console.log('\n🔍 PASO 3: CREANDO ÍNDICES');
    console.log('═══════════════════════════════════════════\n');

    try {
      await db.collection('productos').createIndex({ id: 1 }, { unique: true, sparse: true });
      await db.collection('usuarios').createIndex({ email: 1 }, { unique: true, sparse: true });
      await db.collection('pedidos').createIndex({ usuarioId: 1 });
      await db.collection('categorias').createIndex({ slug: 1 }, { unique: true, sparse: true });
      console.log('   ✅ Índices principales creados');
    } catch (error) {
      console.log('   ℹ️  Algunos índices ya existían');
    }

    // ============================================================
    //                PASO 4: VERIFICACIÓN
    // ============================================================
    console.log('\n📊 PASO 4: VERIFICACIÓN FINAL');
    console.log('═══════════════════════════════════════════\n');

    const colecciones = await db.listCollections().toArray();
    const nombresColecciones = colecciones.map(c => c.name).sort();

    console.log('Colecciones creadas:');
    for (const nombre of nombresColecciones) {
      const count = await db.collection(nombre).countDocuments();
      const icono = count > 0 ? '✅' : '○';
      const nota = nombre === 'productos' ? ' (NO modificada ✓)' : '';
      console.log(`   ${icono} ${nombre.padEnd(25)} (${count} docs)${nota}`);
    }

    // ============================================================
    //                RESUMEN FINAL
    // ============================================================
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  ✅ CONFIGURACIÓN COMPLETADA               ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║  Documentos generados: ${totalDocumentos.toString().padEnd(18)} ║`);
    console.log(`║  Total colecciones: ${nombresColecciones.length.toString().padEnd(21)} ║`);
    console.log('╠════════════════════════════════════════════╣');
    console.log('║  ℹ️  PRODUCTOS: Conservados intactos       ║');
    console.log('║  🎯 SISTEMA LISTO PARA USAR                ║');
    console.log('╚════════════════════════════════════════════╝\n');

    console.log('✨ Próximos pasos:');
    console.log('   1. node server.js (iniciar servidor)');
    console.log('   2. Abre http://localhost:3000');
    console.log('   3. ¡Tus productos están intactos! 🚀\n');

  } catch (error) {
    console.error('\n❌ Error en la configuración:', error);
    process.exit(1);
  } finally {
    await closeDB();
  }
}

// Ejecutar
setupComplete().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});