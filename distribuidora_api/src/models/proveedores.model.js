const pool = require('../config/db');

async function findAll({ nombre }) {
  let sql = 'SELECT * FROM proveedores WHERE 1 = 1';
  const params = [];

  if (nombre) {
    sql += ' AND nombre LIKE ?';
    params.push(`%${nombre}%`);
  }

  const [rows] = await pool.execute(sql + ' ORDER BY id', params);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM proveedores WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ nombre, cuit_empresa, numero_telefono, direccion, email }) {
  const [result] = await pool.execute(
    `INSERT INTO proveedores (nombre, cuit_empresa, numero_telefono, direccion, email)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, cuit_empresa, numero_telefono, direccion, email]
  );
  return result.insertId;
}

async function update(id, { nombre, cuit_empresa, numero_telefono, direccion, email }) {
  const [result] = await pool.execute(
    `UPDATE proveedores
     SET nombre = ?, cuit_empresa = ?, numero_telefono = ?, direccion = ?, email = ?
     WHERE id = ?`,
    [nombre, cuit_empresa, numero_telefono, direccion, email, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.execute('DELETE FROM proveedores WHERE id = ?', [id]);
  return result.affectedRows;
}

async function findProductos(id) {
  const [rows] = await pool.execute(
    `SELECT p.id, p.nombre, p.categoria, p.precio_pesos, p.stock
     FROM productos p
     INNER JOIN proveedores pr ON p.proveedor_id = pr.id
     WHERE pr.id = ?`,
    [id]
  );
  return rows;
}

async function getEstadisticas() {
  const [rows] = await pool.execute(
    `SELECT pr.id, pr.nombre,
            COUNT(p.id) AS cantidad_productos,
            AVG(p.precio_pesos) AS precio_promedio
     FROM proveedores pr
     LEFT JOIN productos p ON p.proveedor_id = pr.id
     GROUP BY pr.id, pr.nombre`
  );
  return rows;
}

module.exports = { findAll, findById, create, update, remove, findProductos, getEstadisticas };
