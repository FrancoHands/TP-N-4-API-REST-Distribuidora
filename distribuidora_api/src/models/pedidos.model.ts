import prisma from '../config/prisma.js';
import totalPedido from '../utils/totalPedido.js';

interface DatosPedido {
  cliente_id: number;
  empleado_id: number;
  compania_envio_id: number;
}

interface ItemPedido {
  producto_id: number;
  cantidad: number;
  precio_unitario: number | string;
}

const incluirRelaciones = {
  clientes: { select: { nombre: true } },
  empleados: { select: { nombre: true } },
  companias_envio: { select: { nombre: true } },
  detalle_pedido: { include: { productos: { select: { nombre: true } } } }
};

function resumir(pedido: {
  id: number;
  fecha_pedido: Date;
  clientes: { nombre: string };
  empleados: { nombre: string };
  companias_envio: { nombre: string };
  detalle_pedido: { cantidad: number; precio_unitario: unknown }[];
}) {
  return {
    id: pedido.id,
    fecha_pedido: pedido.fecha_pedido,
    cliente: pedido.clientes.nombre,
    empleado: pedido.empleados.nombre,
    compania_envio: pedido.companias_envio.nombre,
    total: totalPedido(pedido.detalle_pedido)
  };
}

async function findAll({ cliente_id }: { cliente_id?: string }) {
  const pedidos = await prisma.pedidos.findMany({
    where: {
      detalle_pedido: { some: {} },
      ...(cliente_id && { cliente_id: Number(cliente_id) })
    },
    include: incluirRelaciones,
    orderBy: { id: 'asc' }
  });
  return pedidos.map(resumir);
}

async function findById(id: number) {
  const pedido = await prisma.pedidos.findUnique({ where: { id }, include: incluirRelaciones });

  if (!pedido) {
    return null;
  }

  return {
    ...resumir(pedido),
    items: pedido.detalle_pedido.map((d) => ({
      producto: d.productos.nombre,
      cantidad: d.cantidad,
      precio_unitario: d.precio_unitario
    }))
  };
}

async function create(datos: DatosPedido, items: ItemPedido[]) {
  const pedido = await prisma.pedidos.create({
    data: {
      ...datos,
      detalle_pedido: {
        create: items.map(({ producto_id, cantidad, precio_unitario }) => ({
          producto_id,
          cantidad,
          precio_unitario
        }))
      }
    }
  });
  return pedido.id;
}

function update(id: number, datos: DatosPedido) {
  return prisma.pedidos.update({ where: { id }, data: datos });
}

function remove(id: number) {
  return prisma.pedidos.delete({ where: { id } });
}

export { findAll, findById, create, update, remove };
