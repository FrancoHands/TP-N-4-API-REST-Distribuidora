import express from 'express';
import * as controller from '../controllers/informes.controller.js';

const router = express.Router();

router.get('/ventas-por-proveedor', controller.getVentasPorProveedor);

export default router;
