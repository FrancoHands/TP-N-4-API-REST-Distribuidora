import prisma from '../config/prisma.js';

interface DatosProveedor {
  nombre: string;
  cuit_empresa: string;
  numero_telefono: string;
  direccion: string;
  email: string;
}

function findAll({ nombre }: { nombre?: string }) {
  return prisma.proveedores.findMany({
    where: nombre ? { nombre: { contains: nombre } } : {},
    orderBy: { id: 'asc' }
  });
}

function findById(id: number) {
  return prisma.proveedores.findUnique({ where: { id } });
}

async function create(datos: DatosProveedor) {
  const proveedor = await prisma.proveedores.create({ data: datos });
  return proveedor.id;
}

function update(id: number, datos: DatosProveedor) {
  return prisma.proveedores.update({ where: { id }, data: datos });
}

function remove(id: number) {
  return prisma.proveedores.delete({ where: { id } });
}

function findProductos(proveedor_id: number) {
  return prisma.productos.findMany({
    where: { proveedor_id },
    select: { id: true, nombre: true, categoria: true, precio_pesos: true, stock: true }
  });
}

async function getEstadisticas() {
  const [proveedores, agrupados] = await Promise.all([
    prisma.proveedores.findMany({ select: { id: true, nombre: true }, orderBy: { id: 'asc' } }),
    prisma.productos.groupBy({
      by: ['proveedor_id'],
      _count: { id: true },
      _avg: { precio_pesos: true }
    })
  ]);

  return proveedores.map((proveedor) => {
    const grupo = agrupados.find((g) => g.proveedor_id === proveedor.id);
    return {
      ...proveedor,
      cantidad_productos: grupo?._count.id ?? 0,
      precio_promedio: grupo?._avg.precio_pesos ?? null
    };
  });
}

export { findAll, findById, create, update, remove, findProductos, getEstadisticas };
