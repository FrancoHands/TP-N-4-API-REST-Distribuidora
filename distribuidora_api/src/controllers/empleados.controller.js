const Empleado = require('../models/empleados.model');

async function getAll(req, res, next) {
  try {
    const { cargo } = req.query;
    res.status(200).json(await Empleado.findAll({ cargo }));
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
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

async function create(req, res, next) {
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

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { nombre, apellido, cargo, email, fecha_ingreso } = req.body;

    if (!nombre || !apellido || !cargo || !email || !fecha_ingreso) {
      return res.status(400).json({ error: 'Faltan datos obligatorios del empleado' });
    }

    const filas = await Empleado.update(id, { nombre, apellido, cargo, email, fecha_ingreso });

    if (filas === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.status(200).json(await Empleado.findById(id));
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const filas = await Empleado.remove(Number(req.params.id));

    if (filas === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getPedidos(req, res, next) {
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

async function getEstadisticas(req, res, next) {
  try {
    res.status(200).json(await Empleado.getEstadisticas());
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove, getPedidos, getEstadisticas };
