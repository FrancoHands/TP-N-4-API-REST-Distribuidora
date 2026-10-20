const Producto = require('../models/productos.model');

async function getAll(req, res, next) {
  try {
    const { categoria, precio_max } = req.query;

    if (precio_max !== undefined && isNaN(Number(precio_max))) {
      return res.status(400).json({ error: 'precio_max debe ser un número' });
    }

    res.status(200).json(await Producto.findAll({ categoria, precio_max }));
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
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

async function create(req, res, next) {
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

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { nombre, categoria, marca, precio_pesos, stock, proveedor_id } = req.body;

    if (!nombre || !categoria || !marca || precio_pesos === undefined || stock === undefined || !proveedor_id) {
      return res.status(400).json({ error: 'Faltan datos obligatorios del producto' });
    }

    const filas = await Producto.update(id, { nombre, categoria, marca, precio_pesos, stock, proveedor_id });

    if (filas === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(await Producto.findById(id));
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const filas = await Producto.remove(Number(req.params.id));

    if (filas === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getEstadisticas(req, res, next) {
  try {
    res.status(200).json(await Producto.getEstadisticas());
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove, getEstadisticas };
