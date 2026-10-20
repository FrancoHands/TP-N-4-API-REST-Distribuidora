const pool = require('../config/db');

async function findAll({ nombre }) {
  let sql = 'SELECT * FROM companias_envio WHERE 1 = 1';
  const params = [];

  if (nombre) {
    sql += ' AND nombre LIKE ?';
    params.push(`%${nombre}%`);
  }

  const [rows] = await pool.execute(sql + ' ORDER BY id', params);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM companias_envio WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ nombre, numero_telefono }) {
  const [result] = await pool.execute(
    'INSERT INTO companias_envio (nombre, numero_telefono) VALUES (?, ?)',
    [nombre, numero_telefono]
  );
  return result.insertId;
}

async function update(id, { nombre, numero_telefono }) {
  const [result] = await pool.execute(
    'UPDATE companias_envio SET nombre = ?, numero_telefono = ? WHERE id = ?',
    [nombre, numero_telefono, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.execute('DELETE FROM companias_envio WHERE id = ?', [id]);
  return result.affectedRows;
}

async function findPedidos(id) {
  const [rows] = await pool.execute(
    `SELECT p.id, p.fecha_pedido, c.nombre AS cliente, c.ciudad
     FROM pedidos p
     INNER JOIN clientes c ON p.cliente_id = c.id
     WHERE p.compania_envio_id = ?`,
    [id]
  );
  return rows;
}

async function getEstadisticas() {
  const [rows] = await pool.execute(
    `SELECT ce.id, ce.nombre, COUNT(p.id) AS cantidad_pedidos
     FROM companias_envio ce
     LEFT JOIN pedidos p ON p.compania_envio_id = ce.id
     GROUP BY ce.id, ce.nombre`
  );
  return rows;
}

module.exports = { findAll, findById, create, update, remove, findPedidos, getEstadisticas };
