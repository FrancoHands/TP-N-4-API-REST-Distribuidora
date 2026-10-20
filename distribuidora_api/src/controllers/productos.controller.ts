import type { NextFunction, Request, Response } from 'express';
import * as Producto from '../models/productos.model.js';

async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const categoria = req.query.categoria as string | undefined;
    const precio_max = req.query.precio_max as string | undefined;

    if (precio_max !== undefined && isNaN(Number(precio_max))) {
      return res.status(400).json({ error: 'precio_max debe ser un número' });
    }

    res.status(200).json(await Producto.findAll({ categoria, precio_max }));
  } catch (error) {
    next(error);
  }
}

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const producto = await Producto.findById(Number(req.params.id));

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(producto);
  } catch (error) {
    next(error);
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { nombre, categoria, marca, precio_pesos, stock, proveedor_id } = req.body;

    if (!nombre || !categoria || !marca || precio_pesos === undefined || stock === undefined || !proveedor_id) {
      return res.status(400).json({ error: 'Faltan datos obligatorios del producto' });
    }

    const id = await Producto.create({ nombre, categoria, marca, precio_pesos, stock, proveedor_id });
    res.status(201).json(await Producto.findById(id));
  } catch (error) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { nombre, categoria, marca, precio_pesos, stock, proveedor_id } = req.body;

    if (!nombre || !categoria || !marca || precio_pesos === undefined || stock === undefined || !proveedor_id) {
      return res.status(400).json({ error: 'Faltan datos obligatorios del producto' });
    }

    const actualizado = await Producto.update(id, { nombre, categoria, marca, precio_pesos, stock, proveedor_id });
    res.status(200).json(actualizado);
  } catch (error) {
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await Producto.remove(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getEstadisticas(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await Producto.getEstadisticas());
  } catch (error) {
    next(error);
  }
}

export { getAll, getById, create, update, remove, getEstadisticas };
