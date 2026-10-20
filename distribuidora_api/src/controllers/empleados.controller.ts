import type { NextFunction, Request, Response } from 'express';
import * as Empleado from '../models/empleados.model.js';

async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const cargo = req.query.cargo as string | undefined;
    res.status(200).json(await Empleado.findAll({ cargo }));
  } catch (error) {
    next(error);
  }
}

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const empleado = await Empleado.findById(Number(req.params.id));

    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.status(200).json(empleado);
  } catch (error) {
    next(error);
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { nombre, apellido, cargo, email, fecha_ingreso } = req.body;

    if (!nombre || !apellido || !cargo || !email || !fecha_ingreso) {
      return res.status(400).json({ error: 'Faltan datos obligatorios del empleado' });
    }

    const id = await Empleado.create({ nombre, apellido, cargo, email, fecha_ingreso });
    res.status(201).json(await Empleado.findById(id));
  } catch (error) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { nombre, apellido, cargo, email, fecha_ingreso } = req.body;

    if (!nombre || !apellido || !cargo || !email || !fecha_ingreso) {
      return res.status(400).json({ error: 'Faltan datos obligatorios del empleado' });
    }

    const actualizado = await Empleado.update(id, { nombre, apellido, cargo, email, fecha_ingreso });
    res.status(200).json(actualizado);
  } catch (error) {
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await Empleado.remove(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getPedidos(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    if (!(await Empleado.findById(id))) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.status(200).json(await Empleado.findPedidos(id));
  } catch (error) {
    next(error);
  }
}

async function getEstadisticas(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await Empleado.getEstadisticas());
  } catch (error) {
    next(error);
  }
}

export { getAll, getById, create, update, remove, getPedidos, getEstadisticas };
