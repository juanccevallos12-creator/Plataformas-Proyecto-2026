// server/routes/pagos.routes.js
import express from 'express';
import prisma from '../config/prisma.js';
import { PagosController } from '../controllers/pagos.controllers.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// ============================================================
//            TODAS LAS RUTAS DE PAGOS REQUIEREN AUTH
// ============================================================
router.use(auth);

// ============================================================
//            LISTAR PAGOS (USADO POR PANEL ADMIN)
//            GET /api/pagos
// ============================================================
router.get('/', async (req, res, next) => {
  try {
    const pagos = await prisma.pago.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'success',
      data: pagos
    });
  } catch (err) {
    console.error('Error listando pagos:', err);
    next(err);
  }
});

// ============================================================
//            PROCESAR PAGO (FUNCIONAL)
//            POST /api/pagos/procesar
// ============================================================
router.post('/procesar', PagosController.procesarPago);

// ============================================================
//            VER ESTADO DE PAGO
//            GET /api/pagos/:id/estado
// ============================================================
router.get('/:id/estado', PagosController.verificarEstado);

export default router;
