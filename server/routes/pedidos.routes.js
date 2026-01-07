// server/routes/pedidos.routes.js
import express from 'express';
import { PedidosController } from '../controllers/pedidos.controllers.js'; // ← CON S
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', PedidosController.crear);
router.get('/', auth, PedidosController.listar);
router.get('/:id', auth, PedidosController.obtenerPorId);
router.get('/usuario/:usuarioId', auth, PedidosController.obtenerPorUsuario);
router.put('/:id', auth, PedidosController.actualizar);
router.delete('/:id', auth, PedidosController.eliminar);

export default router;