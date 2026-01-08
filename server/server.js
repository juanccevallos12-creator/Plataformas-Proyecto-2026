// server/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import prisma from './config/prisma.js';

// ============================================================
//                      IMPORTAR RUTAS ESPECÍFICAS
// ============================================================
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
import contactosRoutes from './routes/contactos.routes.js';
import enviosRoutes from './routes/envios.routes.js';
import facturacionRoutes from './routes/facturacion.routes.js';
import imagesRoutes from './routes/images.routes.js';
import pagosRoutes from './routes/pagos.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import productosRoutes from './routes/productos.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import marcasRoutes from './routes/marcas.routes.js';
import monedasRoutes from './routes/monedas.routes.js';

// ============================================================
//                      IMPORTAR CONTROLADORES GENÉRICOS
// ============================================================
import {
  CategoriasController,
  ClientesController,
  UbicacionesController,
  FacturasController,
  PagosGenericController,
  EnviosGenericController,
  DescuentosController,
  BodegaController,
  ProveedoresController,
  OrdenesCompraController,
  MovimientosController,
  PaisesController,
  CiudadesController,
  RolesController,
  EstadosController,
  FormaPagoController,
  UnidadesMedidasController,
  ContactosController,  
  AjustesController,
  BitacoraController
} from './controllers/generic.controllers.js';

import { createGenericRoutes } from './routes/generic.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
//                      MIDDLEWARES
// ============================================================

// ✅ CONFIGURACIÓN CORS MEJORADA
const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'https://celadon-stardust-45ddf1.netlify.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Elimina valores undefined

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (como mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('⚠️ Origen bloqueado por CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging de peticiones (desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================================
//                    RUTA PRINCIPAL
// ============================================================
app.get('/', (req, res) => {
  res.json({ 
    message: '🛒 API E-Commerce - New Era Tech',
    version: '2.0.0',
    database: 'Supabase PostgreSQL',
    status: 'online',
    endpoints: {
      // Rutas principales
      admin: '/api/admin',
      auth: '/api/auth',
      productos: '/api/productos',
      pedidos: '/api/pedidos',
      usuarios: '/api/usuarios',
      
      // Rutas de ventas
      carrito: '/api/carrito',
      facturas: '/api/facturas',
      pagos: '/api/pagos',
      envios: '/api/envios',
      descuentos: '/api/descuentos',
      
      // Rutas de clientes
      clientes: '/api/clientes',
      contactos: '/api/contactos',
      ubicaciones: '/api/ubicaciones',
      
      // Rutas de inventario
      bodega: '/api/bodega',
      proveedores: '/api/proveedores',
      ordenesCompra: '/api/ordenes-compra',
      movimientos: '/api/movimientos',
      
      // Rutas de configuración
      categorias: '/api/categorias',
      paises: '/api/paises',
      ciudades: '/api/ciudades',
      roles: '/api/roles',
      estados: '/api/estados',
      formaPago: '/api/forma-pago',
      unidadesMedidas: '/api/unidades-medidas',
      ajustes: '/api/ajustes',
      bitacora: '/api/bitacora',
      
      // Utilidades
      facturacion: '/api/facturacion',
      images: '/api/images'
    }
  });
});

// ============================================================
//                    REGISTRAR RUTAS PRINCIPALES
// ============================================================
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/contactos', contactosRoutes);
app.use('/api/facturacion', facturacionRoutes);
app.use('/api/images', imagesRoutes);

// Rutas específicas que tienen lógica especial
app.use('/api/envios', enviosRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/marcas', marcasRoutes);      
app.use('/api/monedas', monedasRoutes);

// ============================================================
//                    REGISTRAR RUTAS GENÉRICAS
// ============================================================
// Catálogo
app.use('/api/categorias', createGenericRoutes(CategoriasController));

// Clientes
app.use('/api/clientes', createGenericRoutes(ClientesController));
app.use('/api/ubicaciones', createGenericRoutes(UbicacionesController));

// Ventas
app.use('/api/facturas', createGenericRoutes(FacturasController));
app.use('/api/descuentos', createGenericRoutes(DescuentosController));
app.use('/api/contactos', createGenericRoutes(ContactosController));

// Inventario
app.use('/api/bodega', createGenericRoutes(BodegaController));
app.use('/api/proveedores', createGenericRoutes(ProveedoresController));
app.use('/api/ordenes-compra', createGenericRoutes(OrdenesCompraController));
app.use('/api/movimientos', createGenericRoutes(MovimientosController));

// Geografía
app.use('/api/paises', createGenericRoutes(PaisesController));
app.use('/api/ciudades', createGenericRoutes(CiudadesController));

// Configuración
app.use('/api/roles', createGenericRoutes(RolesController));
app.use('/api/estados', createGenericRoutes(EstadosController));
app.use('/api/forma-pago', createGenericRoutes(FormaPagoController));
app.use('/api/unidades-medidas', createGenericRoutes(UnidadesMedidasController));
app.use('/api/ajustes', createGenericRoutes(AjustesController));

// Sistema
app.use('/api/bitacora', createGenericRoutes(BitacoraController));

// ============================================================
//                    RUTA 404
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Ruta ${req.originalUrl} no encontrada`,
    hint: 'Visita GET / para ver todas las rutas disponibles'
  });
});

// ============================================================
//                    MANEJO DE ERRORES
// ============================================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  // Errores de Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({
      status: 'error',
      message: 'Ya existe un registro con esos datos únicos'
    });
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({
      status: 'error',
      message: 'Registro no encontrado'
    });
  }
  
  // Errores de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Error de validación',
      errors: err.errors
    });
  }
  
  // Error genérico
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
});

// ============================================================
//                    INICIAR SERVIDOR
// ============================================================
async function startServer() {
  try {
    // Verificar conexión a Supabase
    await prisma.$connect();
    console.log('\n✅ Conectado a Supabase PostgreSQL');
    
    // Test de consulta
    const productCount = await prisma.producto.count();
    console.log(`📦 Productos en base de datos: ${productCount}`);
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`\n📚 Rutas configuradas:`);
      console.log(`   ✅ 11 rutas específicas`);
      console.log(`   ✅ 15 rutas genéricas (CRUD automático)`);
      console.log(`   ✅ Total: 26 endpoints activos`);
      console.log(`\n💡 Modo: ${process.env.NODE_ENV || 'production'}`);
      console.log(`\n🌐 Orígenes CORS permitidos:`);
      allowedOrigins.forEach(origin => console.log(`   ✅ ${origin}`));
      console.log(`\n🔗 Visita http://localhost:${PORT}/ para ver todas las rutas\n`);
    });
  } catch (error) {
    console.error('\n❌ Error al conectar con Supabase:', error);
    console.error('📋 Verifica:');
    console.error('   1. DATABASE_URL en .env');
    console.error('   2. Conexión a internet');
    console.error('   3. Credenciales de Supabase\n');
    process.exit(1);
  }
}

// ============================================================
//                    MANEJO DE SEÑALES
// ============================================================
process.on('SIGINT', async () => {
  console.log('\n\n🔌 Cerrando conexión con Supabase...');
  await prisma.$disconnect();
  console.log('✅ Desconectado exitosamente');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('\n❌ Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Iniciar servidor
startServer();