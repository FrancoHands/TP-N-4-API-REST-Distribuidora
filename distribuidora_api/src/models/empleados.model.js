const pool = require('../config/db');

async function findAll({ cargo }) {
  let sql = 'SELECT * FROM empleados WHERE 1 = 1';
  const params = [];

  if (cargo) {
    sql += ' AND cargo = ?';
    params.push(cargo);
  }

  const [rows] = await pool.execute(sql + ' ORDER BY id', params);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM empleados WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ nombre, apellido, cargo, email, fecha_ingreso }) {
  const [result] = await pool.execute(
    `INSERT INTO empleados (nombre, apellido, cargo, email, fecha_ingreso)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, apellido, cargo, email, fecha_ingreso]
  );
  return result.insertId;
}

async function update(id, { nombre, apellido, cargo, email, fecha_ingreso }) {
  const [result] = await pool.execute(
    `UPDATE empleados
     SET nombre = ?, apellido = ?, cargo = ?, email = ?, fecha_ingreso = ?
     WHERE id = ?`,
    [nombre, apellido, cargo, email, fecha_ingreso, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.execute('DELETE FROM empleados WHERE id = ?', [id]);
  return result.affectedRows;
}

async function findPedidos(id) {
  const [rows] = await pool.execute(
    `SELECT p.id, p.fecha_pedido, c.nombre AS cliente,
            SUM(d.cantidad * d.precio_unitario) AS total
     FROM pedidos p
     INNER JOIN clientes c ON p.cliente_id = c.id
     INNER JOIN detalle_pedido d ON d.pedido_id = p.id
     WHERE p.empleado_id = ?
     GROUP BY p.id, p.fecha_pedido, c.nombre`,
    [id]
  );
  return rows;
}

async function getEstadisticas() {
  const [rows] = await pool.execute(
    `SELECT e.id, e.nombre, e.apellido,
            COUNT(DISTINCT p.id) AS pedidos_atendidos,
            SUM(d.cantidad * d.precio_unitario) AS total_vendido
     FROM empleados e
     INNER JOIN pedidos p ON p.empleado_id = e.id
     INNER JOIN detalle_pedido d ON d.pedido_id = p.id
     GROUP BY e.id, e.nombre, e.apellido`
  );
  return rows;
}

module.exports = { findAll, findById, create, update, remove, findPedidos, getEstadisticas };
