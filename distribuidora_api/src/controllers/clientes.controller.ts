import type { NextFunction, Request, Response } from 'express';
import * as Cliente from '../models/clientes.model.js';

async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const ciudad = req.query.ciudad as string | undefined;
    res.status(200).json(await Cliente.findAll({ ciudad }));
  } catch (error) {
    next(error);
  }
}

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const cliente = await Cliente.findById(Number(req.params.id));

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    next(error);
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { nombre, numero_telefono, direccion, ciudad, email } = req.body;

    if (!nombre || !numero_telefono || !direccion || !ciudad || !email) {
      return res.status(400).json({ error: 'Faltan datos obligatorios del cliente' });
    }

    const id = await Cliente.create({ nombre, numero_telefono, direccion, ciudad, email });
    res.status(201).json(await Cliente.findById(id));
  } catch (error) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { nombre, numero_telefono, direccion, ciudad, email } = req.body;

    if (!nombre || !numero_telefono || !direccion || !ciudad || !email) {
      return res.status(400).json({ error: 'Faltan datos obligatorios del cliente' });
    }

    const actualizado = await Cliente.update(id, { nombre, numero_telefono, direccion, ciudad, email });
    res.status(200).json(actualizado);
  } catch (error) {
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await Cliente.remove(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getPedidos(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    if (!(await Cliente.findById(id))) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json(await Cliente.findPedidos(id));
  } catch (error) {
    next(error);
  }
}

async function getEstadisticas(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await Cliente.getEstadisticas());
  } catch (error) {
    next(error);
  }
}

export { getAll, getById, create, update, remove, getPedidos, getEstadisticas };
