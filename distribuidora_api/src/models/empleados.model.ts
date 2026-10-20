import prisma from '../config/prisma.js';
import totalPedido from '../utils/totalPedido.js';

interface DatosEmpleado {
  nombre: string;
  apellido: string;
  cargo: string;
  email: string;
  fecha_ingreso: string;
}

function findAll({ cargo }: { cargo?: string }) {
  return prisma.empleados.findMany({
    where: cargo ? { cargo } : {},
    orderBy: { id: 'asc' }
  });
}

function findById(id: number) {
  return prisma.empleados.findUnique({ where: { id } });
}

async function create({ fecha_ingreso, ...datos }: DatosEmpleado) {
  const empleado = await prisma.empleados.create({
    data: { ...datos, fecha_ingreso: new Date(fecha_ingreso) }
  });
  return empleado.id;
}

function update(id: number, { fecha_ingreso, ...datos }: DatosEmpleado) {
  return prisma.empleados.update({
    where: { id },
    data: { ...datos, fecha_ingreso: new Date(fecha_ingreso) }
  });
}

function remove(id: number) {
  return prisma.empleados.delete({ where: { id } });
}

async function findPedidos(empleado_id: number) {
  const pedidos = await prisma.pedidos.findMany({
    where: { empleado_id, detalle_pedido: { some: {} } },
    include: { clientes: { select: { nombre: true } }, detalle_pedido: true },
    orderBy: { id: 'asc' }
  });

  return pedidos.map((p) => ({
    id: p.id,
    fecha_pedido: p.fecha_pedido,
    cliente: p.clientes.nombre,
    total: totalPedido(p.detalle_pedido)
  }));
}

async function getEstadisticas() {
  const empleados = await prisma.empleados.findMany({
    where: { pedidos: { some: { detalle_pedido: { some: {} } } } },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      pedidos: { select: { detalle_pedido: true } }
    },
    orderBy: { id: 'asc' }
  });

  return empleados.map((e) => ({
    id: e.id,
    nombre: e.nombre,
    apellido: e.apellido,
    pedidos_atendidos: e.pedidos.length,
    total_vendido: totalPedido(e.pedidos.flatMap((p) => p.detalle_pedido))
  }));
}

export { findAll, findById, create, update, remove, findPedidos, getEstadisticas };
