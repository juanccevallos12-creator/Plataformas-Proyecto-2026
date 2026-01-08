import { Router } from 'express';
import {
  getMarcas,
  getMarcaById,
  createMarca,
  updateMarca,
  deleteMarca
} from '../controllers/marcas.controllers.js';

const router = Router();

router.get('/', getMarcas);
router.get('/:id', getMarcaById);
router.post('/', createMarca);
router.put('/:id', updateMarca);
router.delete('/:id', deleteMarca);

export default router;