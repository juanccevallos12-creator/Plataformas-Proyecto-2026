// server/routes/productos.routes.js
import express from 'express';
import { ProductosController } from '../controllers/productos.controllers.js'; // ← CON S
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', ProductosController.listar);
router.get('/buscar', ProductosController.buscar);
router.get('/:id', ProductosController.buscarPorId);

router.post('/', auth, ProductosController.crear);
router.put('/:id', auth, ProductosController.actualizar);
router.delete('/:id', auth, ProductosController.eliminar);

export default router;