import express from 'express';
import * as controller from '../controllers/companiasEnvio.controller.js';
import validarId from '../middlewares/validarId.js';

const router = express.Router();

router.get('/estadisticas', controller.getEstadisticas);
router.get('/', controller.getAll);
router.get('/:id', validarId, controller.getById);
router.get('/:id/pedidos', validarId, controller.getPedidos);
router.post('/', controller.create);
router.put('/:id', validarId, controller.update);
router.delete('/:id', validarId, controller.remove);

export default router;
