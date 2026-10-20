const Pedido = require('../models/pedidos.model');

async function getAll(req, res, next) {
  try {
    const { cliente_id } = req.query;

    if (cliente_id !== undefined && !Number.isInteger(Number(cliente_id))) {
      return res.status(400).json({ error: 'cliente_id debe ser un número entero' });
    }

    res.status(200).json(await Pedido.findAll({ cliente_id }));
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
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

async function create(req, res, next) {
  try {
    const { cliente_id, empleado_id, compania_envio_id, items } = req.body;

    if (!cliente_id || !empleado_id || !compania_envio_id) {
      return res.status(400).json({ error: 'Faltan cliente_id, empleado_id o compania_envio_id' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El pedido necesita al menos un item' });
    }
    for (const item of items) {
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

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { cliente_id, empleado_id, compania_envio_id } = req.body;

    if (!cliente_id || !empleado_id || !compania_envio_id) {
      return res.status(400).json({ error: 'Faltan cliente_id, empleado_id o compania_envio_id' });
    }

    const filas = await Pedido.update(id, { cliente_id, empleado_id, compania_envio_id });

    if (filas === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.status(200).json(await Pedido.findById(id));
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const filas = await Pedido.remove(Number(req.params.id));

    if (filas === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove };
