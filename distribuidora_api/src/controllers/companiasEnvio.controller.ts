import type { NextFunction, Request, Response } from 'express';
import * as Compania from '../models/companiasEnvio.model.js';

async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const nombre = req.query.nombre as string | undefined;
    res.status(200).json(await Compania.findAll({ nombre }));
  } catch (error) {
    next(error);
  }
}

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const compania = await Compania.findById(Number(req.params.id));

    if (!compania) {
      return res.status(404).json({ error: 'Compañía de envío no encontrada' });
    }

    res.status(200).json(compania);
  } catch (error) {
    next(error);
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { nombre, numero_telefono } = req.body;

    if (!nombre || !numero_telefono) {
      return res.status(400).json({ error: 'Faltan datos obligatorios de la compañía' });
    }

    const id = await Compania.create({ nombre, numero_telefono });
    res.status(201).json(await Compania.findById(id));
  } catch (error) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { nombre, numero_telefono } = req.body;

    if (!nombre || !numero_telefono) {
      return res.status(400).json({ error: 'Faltan datos obligatorios de la compañía' });
    }

    const actualizado = await Compania.update(id, { nombre, numero_telefono });
    res.status(200).json(actualizado);
  } catch (error) {
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await Compania.remove(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getPedidos(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    if (!(await Compania.findById(id))) {
      return res.status(404).json({ error: 'Compañía de envío no encontrada' });
    }

    res.status(200).json(await Compania.findPedidos(id));
  } catch (error) {
    next(error);
  }
}

async function getEstadisticas(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await Compania.getEstadisticas());
  } catch (error) {
    next(error);
  }
}

export { getAll, getById, create, update, remove, getPedidos, getEstadisticas };
