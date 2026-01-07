// server/routes/envios.routes.js
import express from 'express';
import prisma from '../config/prisma.js';
import { EnviosController } from '../controllers/envios.controllers.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// ============================================================
//            TODAS LAS RUTAS DE ENVÍOS REQUIEREN AUTH
// ============================================================
router.use(auth);

// ============================================================
//            LISTAR ENVÍOS (USADO POR PANEL ADMIN)
//            GET /api/envios
// ============================================================
router.get('/', async (req, res, next) => {
  try {
    const envios = await prisma.envio.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'success',
      data: envios
    });
  } catch (err) {
    console.error('Error listando envíos:', err);
    next(err);
  }
});

// ============================================================
//            CALCULAR COSTO DE ENVÍO (FUNCIONAL)
//            POST /api/envios/calcular
// ============================================================
router.post('/calcular', EnviosController.calcularCosto);

// ============================================================
//            OBTENER OPCIONES DE ENVÍO
//            GET /api/envios/opciones
// ============================================================
router.get('/opciones', EnviosController.obtenerOpciones);

export default router;
