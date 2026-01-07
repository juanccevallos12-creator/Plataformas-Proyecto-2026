// server/scripts/migrateToPostgres.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { connectDB as connectMongo, closeDB as closeMongo, getDB } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env desde la raíz
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const prisma = new PrismaClient();

async function migrarDatos() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  🔄 MIGRACIÓN MongoDB → PostgreSQL    ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    // 1. Conectar a MongoDB
    console.log('📊 Conectando a MongoDB Atlas...');
    const mongoDb = await connectMongo();
    console.log('✅ Conectado a MongoDB\n');

    // 2. Conectar a PostgreSQL (Supabase)
    console.log('🐘 Conectando a PostgreSQL (Supabase)...');
    await prisma.$connect();
    console.log('✅ Conectado a PostgreSQL\n');

    // ============================================================
    // MIGRAR USUARIOS
    // ============================================================
    console.log('👤 Migrando usuarios...');
    const usuariosMongo = await mongoDb.collection('usuarios').find().toArray();
    console.log(`   Encontrados: ${usuariosMongo.length} usuarios`);

    let usuariosMigrados = 0;
    const usuariosMap = new Map(); // Para mapear IDs viejos a nuevos

    for (const usuarioMongo of usuariosMongo) {
      try {
        // Verificar si ya existe por email
        const existe = await prisma.usuario.findUnique({
          where: { email: usuarioMongo.email }
        });

        if (existe) {
          console.log(`   ⏭️  Usuario ya existe: ${usuarioMongo.email}`);
          usuariosMap.set(usuarioMongo.id, existe.id);
          continue;
        }

        const usuarioNuevo = await prisma.usuario.create({
          data: {
            nombre: usuarioMongo.nombre,
            email: usuarioMongo.email,
            password: usuarioMongo.password,
            rol: usuarioMongo.rol || 'cliente',
            permisos: usuarioMongo.permisos || ['ver'],
            activo: usuarioMongo.activo !== false,
            telefono: usuarioMongo.telefono || null,
            direccion: usuarioMongo.direccion || null,
            createdAt: usuarioMongo.createdAt || new Date(),
          }
        });

        usuariosMap.set(usuarioMongo.id, usuarioNuevo.id);
        usuariosMigrados++;
        console.log(`   ✅ Migrado: ${usuarioMongo.email}`);
      } catch (error) {
        console.error(`   ❌ Error migrando usuario ${usuarioMongo.email}:`, error.message);
      }
    }

    console.log(`   📊 Total migrados: ${usuariosMigrados}/${usuariosMongo.length}\n`);

    // ============================================================
    // MIGRAR PRODUCTOS
    // ============================================================
    console.log('📦 Migrando productos...');
    const productosMongo = await mongoDb.collection('productos').find().toArray();
    console.log(`   Encontrados: ${productosMongo.length} productos`);

    let productosMigrados = 0;
    const productosMap = new Map();

    for (const productoMongo of productosMongo) {
      try {
        const productoNuevo = await prisma.producto.create({
          data: {
            nombre: productoMongo.nombre,
            descripcion: productoMongo.descripcion || null,
            precio: parseFloat(productoMongo.precio) || 0,
            stock: parseInt(productoMongo.stock) || 0,
            imagen: productoMongo.imagen || null,
            categoria: productoMongo.categoria || null,
            activo: productoMongo.activo !== false,
            createdAt: productoMongo.createdAt || new Date(),
          }
        });

        productosMap.set(productoMongo.id, productoNuevo.id);
        productosMigrados++;
        console.log(`   ✅ Migrado: ${productoMongo.nombre}`);
      } catch (error) {
        console.error(`   ❌ Error migrando producto ${productoMongo.nombre}:`, error.message);
      }
    }

    console.log(`   📊 Total migrados: ${productosMigrados}/${productosMongo.length}\n`);

    // ============================================================
    // MIGRAR CONTACTOS
    // ============================================================
    console.log('📧 Migrando contactos...');
    const contactosMongo = await mongoDb.collection('contactos').find().toArray();
    console.log(`   Encontrados: ${contactosMongo.length} contactos`);

    let contactosMigrados = 0;

    for (const contactoMongo of contactosMongo) {
      try {
        await prisma.contacto.create({
          data: {
            nombre: contactoMongo.nombre,
            email: contactoMongo.email,
            mensaje: contactoMongo.mensaje,
            leido: contactoMongo.leido || false,
            createdAt: contactoMongo.createdAt || new Date(),
          }
        });

        contactosMigrados++;
        console.log(`   ✅ Migrado: ${contactoMongo.nombre}`);
      } catch (error) {
        console.error(`   ❌ Error migrando contacto:`, error.message);
      }
    }

    console.log(`   📊 Total migrados: ${contactosMigrados}/${contactosMongo.length}\n`);

    // ============================================================
    // MIGRAR PEDIDOS (si existen)
    // ============================================================
    console.log('🛒 Migrando pedidos...');
    const pedidosMongo = await mongoDb.collection('pedidos').find().toArray();
    console.log(`   Encontrados: ${pedidosMongo.length} pedidos`);

    let pedidosMigrados = 0;

    for (const pedidoMongo of pedidosMongo) {
      try {
        // Buscar el nuevo ID del usuario
        const nuevoUsuarioId = usuariosMap.get(pedidoMongo.usuarioId);

        if (!nuevoUsuarioId) {
          console.log(`   ⏭️  Usuario no encontrado para pedido, saltando...`);
          continue;
        }

        const pedidoNuevo = await prisma.pedido.create({
          data: {
            usuarioId: nuevoUsuarioId,
            total: parseFloat(pedidoMongo.total) || 0,
            estado: pedidoMongo.estado || 'pendiente',
            direccion: pedidoMongo.direccion || '',
            telefono: pedidoMongo.telefono || '',
            createdAt: pedidoMongo.createdAt || new Date(),
          }
        });

        // Migrar items del pedido si existen
        if (pedidoMongo.items && Array.isArray(pedidoMongo.items)) {
          for (const item of pedidoMongo.items) {
            const nuevoProductoId = productosMap.get(item.productoId);
            
            if (nuevoProductoId) {
              await prisma.pedidoItem.create({
                data: {
                  pedidoId: pedidoNuevo.id,
                  productoId: nuevoProductoId,
                  cantidad: item.cantidad || 1,
                  precio: parseFloat(item.precio) || 0,
                }
              });
            }
          }
        }

        pedidosMigrados++;
        console.log(`   ✅ Migrado pedido de ${pedidoMongo.usuarioId}`);
      } catch (error) {
        console.error(`   ❌ Error migrando pedido:`, error.message);
      }
    }

    console.log(`   📊 Total migrados: ${pedidosMigrados}/${pedidosMongo.length}\n`);

    // ============================================================
    // RESUMEN FINAL
    // ============================================================
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  ✅ MIGRACIÓN COMPLETADA               ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║  👤 Usuarios:  ${usuariosMigrados.toString().padEnd(24)}║`);
    console.log(`║  📦 Productos: ${productosMigrados.toString().padEnd(24)}║`);
    console.log(`║  📧 Contactos: ${contactosMigrados.toString().padEnd(24)}║`);
    console.log(`║  🛒 Pedidos:   ${pedidosMigrados.toString().padEnd(24)}║`);
    console.log('╚════════════════════════════════════════╝\n');

    // Verificar en PostgreSQL
    const totalUsuarios = await prisma.usuario.count();
    const totalProductos = await prisma.producto.count();
    const totalContactos = await prisma.contacto.count();
    const totalPedidos = await prisma.pedido.count();

    console.log('🔍 Verificación en PostgreSQL:');
    console.log(`   • Usuarios en PostgreSQL:  ${totalUsuarios}`);
    console.log(`   • Productos en PostgreSQL: ${totalProductos}`);
    console.log(`   • Contactos en PostgreSQL: ${totalContactos}`);
    console.log(`   • Pedidos en PostgreSQL:   ${totalPedidos}\n`);

  } catch (error) {
    console.error('\n❌ ERROR EN LA MIGRACIÓN:', error);
    throw error;
  } finally {
    // Cerrar conexiones
    await prisma.$disconnect();
    await closeMongo();
    console.log('🔒 Conexiones cerradas\n');
  }
}

// Ejecutar migración
migrarDatos()
  .then(() => {
    console.log('✅ Proceso completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });