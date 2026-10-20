const pool = require('../config/db');

const SELECT_PRODUCTOS = `
  SELECT p.id, p.nombre, p.categoria, p.marca, p.precio_pesos, p.stock,
         p.proveedor_id, pr.nombre AS proveedor
  FROM productos p
  INNER JOIN proveedores pr ON p.proveedor_id = pr.id`;

async function findAll({ categoria, precio_max }) {
  let sql = `${SELECT_PRODUCTOS} WHERE 1 = 1`;
  const params = [];

  if (categoria) {
    sql += ' AND p.categoria = ?';
    params.push(categoria);
  }
  if (precio_max) {
    sql += ' AND p.precio_pesos <= ?';
    params.push(precio_max);
  }

  const [rows] = await pool.execute(sql + ' ORDER BY p.id', params);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(`${SELECT_PRODUCTOS} WHERE p.id = ?`, [id]);
  return rows[0] || null;
}

async function create({ nombre, categoria, marca, precio_pesos, stock, proveedor_id }) {
  const [result] = await pool.execute(
    `INSERT INTO productos (nombre, categoria, marca, precio_pesos, stock, proveedor_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, categoria, marca, precio_pesos, stock, proveedor_id]
  );
  return result.insertId;
}

async function update(id, { nombre, categoria, marca, precio_pesos, stock, proveedor_id }) {
  const [result] = await pool.execute(
    `UPDATE productos
     SET nombre = ?, categoria = ?, marca = ?, precio_pesos = ?, stock = ?, proveedor_id = ?
     WHERE id = ?`,
    [nombre, categoria, marca, precio_pesos, stock, proveedor_id, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.execute('DELETE FROM productos WHERE id = ?', [id]);
  return result.affectedRows;
}

async function getEstadisticas() {
  const [rows] = await pool.execute(
    `SELECT categoria,
            COUNT(*) AS cantidad_productos,
            SUM(stock) AS stock_total,
            AVG(precio_pesos) AS precio_promedio,
            MIN(precio_pesos) AS precio_minimo,
            MAX(precio_pesos) AS precio_maximo
     FROM productos
     GROUP BY categoria`
  );
  return rows;
}

module.exports = { findAll, findById, create, update, remove, getEstadisticas };
