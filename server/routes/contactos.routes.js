// server/routes/contactos.routes.js
import express from 'express';
import { ContactosController } from '../controllers/contactos.controllers.js'; // ← CON S
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', ContactosController.crear);

router.get('/', auth, ContactosController.listar);
router.get('/:id', auth, ContactosController.buscarPorId);
router.put('/:id/estado', auth, ContactosController.actualizarEstado);
router.delete('/:id', auth, ContactosController.eliminar);

export default router;