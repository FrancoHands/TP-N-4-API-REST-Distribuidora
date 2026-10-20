const express = require('express');
const controller = require('../controllers/clientes.controller');
const validarId = require('../middlewares/validarId');

const router = express.Router();

router.get('/estadisticas', controller.getEstadisticas);
router.get('/', controller.getAll);
router.get('/:id', validarId, controller.getById);
router.get('/:id/pedidos', validarId, controller.getPedidos);
router.post('/', controller.create);
router.put('/:id', validarId, controller.update);
router.delete('/:id', validarId, controller.remove);

module.exports = router;
