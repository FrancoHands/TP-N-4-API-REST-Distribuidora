const pool = require('../config/db');

const SELECT_PEDIDOS = `
  SELECT p.id, p.fecha_pedido,
         c.nombre AS cliente, e.nombre AS empleado, ce.nombre AS compania_envio,
         SUM(d.cantidad * d.precio_unitario) AS total
  FROM pedidos p
  INNER JOIN clientes c ON p.cliente_id = c.id
  INNER JOIN empleados e ON p.empleado_id = e.id
  INNER JOIN companias_envio ce ON p.compania_envio_id = ce.id
  INNER JOIN detalle_pedido d ON d.pedido_id = p.id`;

const GROUP_PEDIDOS = ' GROUP BY p.id, p.fecha_pedido, c.nombre, e.nombre, ce.nombre';

async function findAll({ cliente_id }) {
  let sql = `${SELECT_PEDIDOS} WHERE 1 = 1`;
  const params = [];

  if (cliente_id) {
    sql += ' AND p.cliente_id = ?';
    params.push(cliente_id);
  }

  const [rows] = await pool.execute(sql + GROUP_PEDIDOS + ' ORDER BY p.id', params);
  return rows;
}

async function findById(id) {
  const [pedidos] = await pool.execute(`${SELECT_PEDIDOS} WHERE p.id = ?${GROUP_PEDIDOS}`, [id]);

  if (pedidos.length === 0) {
    return null;
  }

  const [items] = await pool.execute(
    `SELECT pr.nombre AS producto, d.cantidad, d.precio_unitario
     FROM detalle_pedido d
     INNER JOIN productos pr ON d.producto_id = pr.id
     WHERE d.pedido_id = ?`,
    [id]
  );

  return { ...pedidos[0], items };
}

async function create({ cliente_id, empleado_id, compania_envio_id }, items) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [pedido] = await connection.execute(
      'INSERT INTO pedidos (cliente_id, empleado_id, compania_envio_id) VALUES (?, ?, ?)',
      [cliente_id, empleado_id, compania_envio_id]
    );

    for (const item of items) {
      await connection.execute(
        `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [pedido.insertId, item.producto_id, item.cantidad, item.precio_unitario]
      );
    }

    await connection.commit();
    return pedido.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function update(id, { cliente_id, empleado_id, compania_envio_id }) {
  const [result] = await pool.execute(
    'UPDATE pedidos SET cliente_id = ?, empleado_id = ?, compania_envio_id = ? WHERE id = ?',
    [cliente_id, empleado_id, compania_envio_id, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.execute('DELETE FROM pedidos WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { findAll, findById, create, update, remove };
