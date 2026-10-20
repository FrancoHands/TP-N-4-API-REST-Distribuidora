const Proveedor = require('../models/proveedores.model');

async function getAll(req, res, next) {
  try {
    const { nombre } = req.query;
    res.status(200).json(await Proveedor.findAll({ nombre }));
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
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

async function create(req, res, next) {
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

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { nombre, cuit_empresa, numero_telefono, direccion, email } = req.body;

    if (!nombre || !cuit_empresa || !numero_telefono || !direccion || !email) {
      return res.status(400).json({ error: 'Faltan datos obligatorios del proveedor' });
    }

    const filas = await Proveedor.update(id, { nombre, cuit_empresa, numero_telefono, direccion, email });

    if (filas === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.status(200).json(await Proveedor.findById(id));
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const filas = await Proveedor.remove(Number(req.params.id));

    if (filas === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getProductos(req, res, next) {
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

async function getEstadisticas(req, res, next) {
  try {
    res.status(200).json(await Proveedor.getEstadisticas());
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove, getProductos, getEstadisticas };
