import { Router } from 'express';
import {
  getMonedas,
  getMonedaById,
  createMoneda,
  updateMoneda,
  deleteMoneda
} from '../controllers/monedas.controllers.js';

const router = Router();

router.get('/', getMonedas);
router.get('/:id', getMonedaById);
router.post('/', createMoneda);
router.put('/:id', updateMoneda);
router.delete('/:id', deleteMoneda);

export default router;