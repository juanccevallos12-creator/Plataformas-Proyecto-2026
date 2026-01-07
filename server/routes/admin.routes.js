// server/routes/admin.routes.js
import express from 'express';
import { AdminController } from '../controllers/admin.controllers.js'; 
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/dashboard', AdminController.dashboard);
router.get('/reportes/ventas', AdminController.reporteVentas);
router.get('/productos/mas-vendidos', AdminController.productosMasVendidos);
router.get('/pedidos', AdminController.gestionarPedidos);

export default router;