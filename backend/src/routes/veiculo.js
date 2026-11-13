import { Router } from 'express';
import { veiculoController } from '../controllers/veiculoController.js';

const router = Router();

router.get('/', veiculoController.listar);
router.get('/:id', veiculoController.buscarPorId);
router.post('/', veiculoController.criar);
router.put('/:id', veiculoController.atualizar);
router.delete('/:id', veiculoController.remover);

export default router;