const express = require('express');
const controller = require('../controllers/pedidos.controller');
const validarId = require('../middlewares/validarId');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', validarId, controller.getById);
router.post('/', controller.create);
router.put('/:id', validarId, controller.update);
router.delete('/:id', validarId, controller.remove);

module.exports = router;
