const pool = require('../config/db');

async function findAll({ ciudad }) {
  let sql = 'SELECT * FROM clientes WHERE 1 = 1';
  const params = [];

  if (ciudad) {
    sql += ' AND ciudad = ?';
    params.push(ciudad);
  }

  const [rows] = await pool.execute(sql + ' ORDER BY id', params);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ nombre, numero_telefono, direccion, ciudad, email }) {
  const [result] = await pool.execute(
    `INSERT INTO clientes (nombre, numero_telefono, direccion, ciudad, email)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, numero_telefono, direccion, ciudad, email]
  );
  return result.insertId;
}

async function update(id, { nombre, numero_telefono, direccion, ciudad, email }) {
  const [result] = await pool.execute(
    `UPDATE clientes
     SET nombre = ?, numero_telefono = ?, direccion = ?, ciudad = ?, email = ?
     WHERE id = ?`,
    [nombre, numero_telefono, direccion, ciudad, email, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.execute('DELETE FROM clientes WHERE id = ?', [id]);
  return result.affectedRows;
}

async function findPedidos(id) {
  const [rows] = await pool.execute(
    `SELECT p.id, p.fecha_pedido,
            e.nombre AS empleado, ce.nombre AS compania_envio,
            SUM(d.cantidad * d.precio_unitario) AS total
     FROM pedidos p
     INNER JOIN empleados e ON p.empleado_id = e.id
     INNER JOIN companias_envio ce ON p.compania_envio_id = ce.id
     INNER JOIN detalle_pedido d ON d.pedido_id = p.id
     WHERE p.cliente_id = ?
     GROUP BY p.id, p.fecha_pedido, e.nombre, ce.nombre`,
    [id]
  );
  return rows;
}

async function getEstadisticas() {
  const [rows] = await pool.execute(
    `SELECT c.id, c.nombre,
            COUNT(DISTINCT p.id) AS cantidad_pedidos,
            SUM(d.cantidad * d.precio_unitario) AS total_facturado
     FROM clientes c
     INNER JOIN pedidos p ON p.cliente_id = c.id
     INNER JOIN detalle_pedido d ON d.pedido_id = p.id
     GROUP BY c.id, c.nombre`
  );
  return rows;
}

module.exports = { findAll, findById, create, update, remove, findPedidos, getEstadisticas };
