// server/routes/carrito.routes.js
import express from 'express';
import { CarritoController } from '../controllers/carrito.controllers.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Rutas con auth individual (no global)
router.get('/', auth, CarritoController.obtenerCarrito);
router.post('/agregar', auth, CarritoController.agregarItem);
router.put('/actualizar', auth, CarritoController.actualizarCantidad);
router.delete('/:productoId', auth, CarritoController.eliminarItem);
router.delete('/', auth, CarritoController.vaciarCarrito);

export default router;