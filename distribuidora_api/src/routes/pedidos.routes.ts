import express from 'express';
import * as controller from '../controllers/pedidos.controller.js';
import validarId from '../middlewares/validarId.js';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', validarId, controller.getById);
router.post('/', controller.create);
router.put('/:id', validarId, controller.update);
router.delete('/:id', validarId, controller.remove);

export default router;
