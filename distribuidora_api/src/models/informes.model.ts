import prisma from '../config/prisma.js';
import { Prisma } from '../generated/prisma/client.js';

interface FilaVentas {
  proveedor_id: number;
  proveedor: string;
  cantidad_pedidos: bigint;
  unidades_vendidas: bigint;
  monto_total: Prisma.Decimal;
}

async function getVentasPorProveedor({ desde, hasta }: { desde?: Date; hasta?: Date }) {
  const filtroDesde = desde ? Prisma.sql`AND p.fecha_pedido >= ${desde}` : Prisma.empty;
  const filtroHasta = hasta ? Prisma.sql`AND p.fecha_pedido <= ${hasta}` : Prisma.empty;

  const filas = await prisma.$queryRaw<FilaVentas[]>`
    SELECT pr.id AS proveedor_id,
           pr.nombre AS proveedor,
           COUNT(DISTINCT p.id) AS cantidad_pedidos,
           SUM(d.cantidad) AS unidades_vendidas,
           SUM(d.cantidad * d.precio_unitario) AS monto_total
    FROM proveedores pr
    INNER JOIN productos pd ON pd.proveedor_id = pr.id
    INNER JOIN detalle_pedido d ON d.producto_id = pd.id
    INNER JOIN pedidos p ON p.id = d.pedido_id
    WHERE 1 = 1 ${filtroDesde} ${filtroHasta}
    GROUP BY pr.id, pr.nombre
    ORDER BY monto_total DESC`;

  return filas.map((fila) => ({
    proveedor_id: fila.proveedor_id,
    proveedor: fila.proveedor,
    cantidad_pedidos: Number(fila.cantidad_pedidos),
    unidades_vendidas: Number(fila.unidades_vendidas),
    monto_total: Number(fila.monto_total)
  }));
}

export { getVentasPorProveedor };
