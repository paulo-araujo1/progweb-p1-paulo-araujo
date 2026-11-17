import { Router } from 'express';
import { anuncianteController } from '../controllers/anuncianteController.js';

const router = Router();

router.get('/', anuncianteController.listar);
router.get('/:id', anuncianteController.buscarPorId);
router.post('/', anuncianteController.criar);
router.put('/:id', anuncianteController.atualizar);
router.delete('/:id', anuncianteController.remover);

export default router;