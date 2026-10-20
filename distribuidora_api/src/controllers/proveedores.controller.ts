import type { NextFunction, Request, Response } from 'express';
import * as Proveedor from '../models/proveedores.model.js';

async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const nombre = req.query.nombre as string | undefined;
    res.status(200).json(await Proveedor.findAll({ nombre }));
  } catch (error) {
    next(error);
  }
}

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const proveedor = await Proveedor.findById(Number(req.params.id));

    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.status(200).json(proveedor);
  } catch (error) {
    next(error);
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { nombre, cuit_empresa, numero_telefono, direccion, email } = req.body;

    if (!nombre || !cuit_empresa || !numero_telefono || !direccion || !email) {
      return res.status(400).json({ error: 'Faltan datos obligatorios del proveedor' });
    }

    const id = await Proveedor.create({ nombre, cuit_empresa, numero_telefono, direccion, email });
    res.status(201).json(await Proveedor.findById(id));
  } catch (error) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { nombre, cuit_empresa, numero_telefono, direccion, email } = req.body;

    if (!nombre || !cuit_empresa || !numero_telefono || !direccion || !email) {
      return res.status(400).json({ error: 'Faltan datos obligatorios del proveedor' });
    }

    const proveedor = await Proveedor.update(id, { nombre, cuit_empresa, numero_telefono, direccion, email });
    res.status(200).json(proveedor);
  } catch (error) {
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await Proveedor.remove(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getProductos(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    if (!(await Proveedor.findById(id))) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.status(200).json(await Proveedor.findProductos(id));
  } catch (error) {
    next(error);
  }
}

async function getEstadisticas(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await Proveedor.getEstadisticas());
  } catch (error) {
    next(error);
  }
}

export { getAll, getById, create, update, remove, getProductos, getEstadisticas };
