// server/routes/facturacion.routes.js
import express from 'express';
import { FacturacionController } from '../controllers/facturacion.controllers.js'; // ← CON S
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.post('/generar', FacturacionController.generarFactura);
router.get('/:id', FacturacionController.obtenerFactura);

export default router;