interface LineaDetalle {
  cantidad: number;
  precio_unitario: unknown;
}

function totalPedido(detalle: LineaDetalle[]) {
  const total = detalle.reduce((suma, linea) => suma + linea.cantidad * Number(linea.precio_unitario), 0);
  return Math.round(total * 100) / 100;
}

export default totalPedido;
