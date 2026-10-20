import type { NextFunction, Request, Response } from 'express';
import * as Pedido from '../models/pedidos.model.js';

async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const cliente_id = req.query.cliente_id as string | undefined;

    if (cliente_id !== undefined && !Number.isInteger(Number(cliente_id))) {
      return res.status(400).json({ error: 'cliente_id debe ser un número entero' });
    }

    res.status(200).json(await Pedido.findAll({ cliente_id }));
  } catch (error) {
    next(error);
  }
}

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const pedido = await Pedido.findById(Number(req.params.id));

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.status(200).json(pedido);
  } catch (error) {
    next(error);
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { cliente_id, empleado_id, compania_envio_id, items } = req.body;

    if (!cliente_id || !empleado_id || !compania_envio_id) {
      return res.status(400).json({ error: 'Faltan cliente_id, empleado_id o compania_envio_id' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El pedido necesita al menos un item' });
    }
    for (const item of items as { producto_id?: number; cantidad?: number; precio_unitario?: number | string }[]) {
      if (!item.producto_id || !item.cantidad || item.precio_unitario === undefined) {
        return res.status(400).json({ error: 'Cada item necesita producto_id, cantidad y precio_unitario' });
      }
    }

    const id = await Pedido.create({ cliente_id, empleado_id, compania_envio_id }, items);
    res.status(201).json(await Pedido.findById(id));
  } catch (error) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { cliente_id, empleado_id, compania_envio_id } = req.body;

    if (!cliente_id || !empleado_id || !compania_envio_id) {
      return res.status(400).json({ error: 'Faltan cliente_id, empleado_id o compania_envio_id' });
    }

    await Pedido.update(id, { cliente_id, empleado_id, compania_envio_id });
    res.status(200).json(await Pedido.findById(id));
  } catch (error) {
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await Pedido.remove(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export { getAll, getById, create, update, remove };
