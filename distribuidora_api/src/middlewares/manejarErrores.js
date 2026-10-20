function manejarErrores(err, req, res, next) {
  console.error(err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El JSON enviado no es válido' });
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Ya existe un registro con ese valor único' });
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ error: 'El registro tiene recursos relacionados' });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ error: 'Alguno de los ids enviados no existe' });
  }

  if (err.errno === 3819 || err.errno === 4025) {
    return res.status(400).json({ error: 'Alguno de los valores está fuera de rango' });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = manejarErrores;
