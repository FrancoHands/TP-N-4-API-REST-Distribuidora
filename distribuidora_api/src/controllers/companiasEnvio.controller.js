const Compania = require('../models/companiasEnvio.model');

async function getAll(req, res, next) {
  try {
    const { nombre } = req.query;
    res.status(200).json(await Compania.findAll({ nombre }));
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
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

async function create(req, res, next) {
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

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { nombre, numero_telefono } = req.body;

    if (!nombre || !numero_telefono) {
      return res.status(400).json({ error: 'Faltan datos obligatorios de la compañía' });
    }

    const filas = await Compania.update(id, { nombre, numero_telefono });

    if (filas === 0) {
      return res.status(404).json({ error: 'Compañía de envío no encontrada' });
    }

    res.status(200).json(await Compania.findById(id));
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const filas = await Compania.remove(Number(req.params.id));

    if (filas === 0) {
      return res.status(404).json({ error: 'Compañía de envío no encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getPedidos(req, res, next) {
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

async function getEstadisticas(req, res, next) {
  try {
    res.status(200).json(await Compania.getEstadisticas());
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove, getPedidos, getEstadisticas };
