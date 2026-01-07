// server/routes/usuarios.routes.js
import express from 'express';
import { UsuariosController } from '../controllers/usuarios.controllers.js';
import { auth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', UsuariosController.crear);

// Rutas protegidas - requieren auth
router.get('/', auth, UsuariosController.listar);
router.get('/:id', auth, UsuariosController.buscarPorId);
router.put('/:id', auth, UsuariosController.actualizar);
router.delete('/:id', auth, requireAdmin, UsuariosController.eliminar);

export default router;