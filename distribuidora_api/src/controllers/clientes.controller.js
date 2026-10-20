const Cliente = require('../models/clientes.model');

async function getAll(req, res, next) {
  try {
    const { ciudad } = req.query;
    res.status(200).json(await Cliente.findAll({ ciudad }));
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
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

async function create(req, res, next) {
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

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { nombre, numero_telefono, direccion, ciudad, email } = req.body;

    if (!nombre || !numero_telefono || !direccion || !ciudad || !email) {
      return res.status(400).json({ error: 'Faltan datos obligatorios del cliente' });
    }

    const filas = await Cliente.update(id, { nombre, numero_telefono, direccion, ciudad, email });

    if (filas === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json(await Cliente.findById(id));
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const filas = await Cliente.remove(Number(req.params.id));

    if (filas === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getPedidos(req, res, next) {
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

async function getEstadisticas(req, res, next) {
  try {
    res.status(200).json(await Cliente.getEstadisticas());
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove, getPedidos, getEstadisticas };
