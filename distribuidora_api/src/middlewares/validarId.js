function validarId(req, res, next) {
  if (!Number.isInteger(Number(req.params.id))) {
    return res.status(400).json({ error: 'El id debe ser un número entero' });
  }
  next();
}

module.exports = validarId;
