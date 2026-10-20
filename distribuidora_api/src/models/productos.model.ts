import prisma from '../config/prisma.js';

interface DatosProducto {
  nombre: string;
  categoria: string;
  marca: string;
  precio_pesos: number | string;
  stock: number;
  proveedor_id: number;
}

const incluirProveedor = { proveedores: { select: { nombre: true } } };

function aplanar<T extends { proveedores: { nombre: string } }>({ proveedores, ...producto }: T) {
  return { ...producto, proveedor: proveedores.nombre };
}

async function findAll({ categoria, precio_max }: { categoria?: string; precio_max?: string }) {
  const productos = await prisma.productos.findMany({
    where: {
      ...(categoria && { categoria }),
      ...(precio_max && { precio_pesos: { lte: precio_max } })
    },
    include: incluirProveedor,
    orderBy: { id: 'asc' }
  });
  return productos.map(aplanar);
}

async function findById(id: number) {
  const producto = await prisma.productos.findUnique({ where: { id }, include: incluirProveedor });
  return producto && aplanar(producto);
}

async function create(datos: DatosProducto) {
  const producto = await prisma.productos.create({ data: datos });
  return producto.id;
}

async function update(id: number, datos: DatosProducto) {
  return aplanar(await prisma.productos.update({ where: { id }, data: datos, include: incluirProveedor }));
}

function remove(id: number) {
  return prisma.productos.delete({ where: { id } });
}

async function getEstadisticas() {
  const grupos = await prisma.productos.groupBy({
    by: ['categoria'],
    _count: { id: true },
    _sum: { stock: true },
    _avg: { precio_pesos: true },
    _min: { precio_pesos: true },
    _max: { precio_pesos: true }
  });

  return grupos.map((g) => ({
    categoria: g.categoria,
    cantidad_productos: g._count.id,
    stock_total: g._sum.stock,
    precio_promedio: g._avg.precio_pesos,
    precio_minimo: g._min.precio_pesos,
    precio_maximo: g._max.precio_pesos
  }));
}

export { findAll, findById, create, update, remove, getEstadisticas };
