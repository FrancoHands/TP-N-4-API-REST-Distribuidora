import prisma from '../config/prisma.js';
import totalPedido from '../utils/totalPedido.js';

interface DatosCliente {
  nombre: string;
  numero_telefono: string;
  direccion: string;
  ciudad: string;
  email: string;
}

function findAll({ ciudad }: { ciudad?: string }) {
  return prisma.clientes.findMany({
    where: ciudad ? { ciudad } : {},
    orderBy: { id: 'asc' }
  });
}

function findById(id: number) {
  return prisma.clientes.findUnique({ where: { id } });
}

async function create(datos: DatosCliente) {
  const cliente = await prisma.clientes.create({ data: datos });
  return cliente.id;
}

function update(id: number, datos: DatosCliente) {
  return prisma.clientes.update({ where: { id }, data: datos });
}

function remove(id: number) {
  return prisma.clientes.delete({ where: { id } });
}

async function findPedidos(cliente_id: number) {
  const pedidos = await prisma.pedidos.findMany({
    where: { cliente_id, detalle_pedido: { some: {} } },
    include: {
      empleados: { select: { nombre: true } },
      companias_envio: { select: { nombre: true } },
      detalle_pedido: true
    },
    orderBy: { id: 'asc' }
  });

  return pedidos.map((p) => ({
    id: p.id,
    fecha_pedido: p.fecha_pedido,
    empleado: p.empleados.nombre,
    compania_envio: p.companias_envio.nombre,
    total: totalPedido(p.detalle_pedido)
  }));
}

async function getEstadisticas() {
  const clientes = await prisma.clientes.findMany({
    where: { pedidos: { some: { detalle_pedido: { some: {} } } } },
    select: {
      id: true,
      nombre: true,
      pedidos: { select: { detalle_pedido: true } }
    },
    orderBy: { id: 'asc' }
  });

  return clientes.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    cantidad_pedidos: c.pedidos.length,
    total_facturado: totalPedido(c.pedidos.flatMap((p) => p.detalle_pedido))
  }));
}

export { findAll, findById, create, update, remove, findPedidos, getEstadisticas };
