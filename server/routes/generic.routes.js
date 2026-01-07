// server/routes/generic.routes.js
import express from 'express';

export function createGenericRoutes(controller) {
  const router = express.Router();
  
  router.get('/', controller.listar);
  router.get('/:id', controller.buscarPorId);
  router.post('/', controller.crear);
  router.put('/:id', controller.actualizar);
  router.delete('/:id', controller.eliminar);
  
  return router;
}