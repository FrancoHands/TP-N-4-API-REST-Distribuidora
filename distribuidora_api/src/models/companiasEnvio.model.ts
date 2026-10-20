import prisma from '../config/prisma.js';

interface DatosCompania {
  nombre: string;
  numero_telefono: string;
}

function findAll({ nombre }: { nombre?: string }) {
  return prisma.companias_envio.findMany({
    where: nombre ? { nombre: { contains: nombre } } : {},
    orderBy: { id: 'asc' }
  });
}

function findById(id: number) {
  return prisma.companias_envio.findUnique({ where: { id } });
}

async function create(datos: DatosCompania) {
  const compania = await prisma.companias_envio.create({ data: datos });
  return compania.id;
}

function update(id: number, datos: DatosCompania) {
  return prisma.companias_envio.update({ where: { id }, data: datos });
}

function remove(id: number) {
  return prisma.companias_envio.delete({ where: { id } });
}

async function findPedidos(compania_envio_id: number) {
  const pedidos = await prisma.pedidos.findMany({
    where: { compania_envio_id },
    select: {
      id: true,
      fecha_pedido: true,
      clientes: { select: { nombre: true, ciudad: true } }
    },
    orderBy: { id: 'asc' }
  });

  return pedidos.map((p) => ({
    id: p.id,
    fecha_pedido: p.fecha_pedido,
    cliente: p.clientes.nombre,
    ciudad: p.clientes.ciudad
  }));
}

async function getEstadisticas() {
  const companias = await prisma.companias_envio.findMany({
    select: { id: true, nombre: true, _count: { select: { pedidos: true } } },
    orderBy: { id: 'asc' }
  });

  return companias.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    cantidad_pedidos: c._count.pedidos
  }));
}

export { findAll, findById, create, update, remove, findPedidos, getEstadisticas };
