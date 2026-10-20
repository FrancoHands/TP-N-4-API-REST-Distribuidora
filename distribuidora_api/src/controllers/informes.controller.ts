import type { NextFunction, Request, Response } from 'express';
import * as Informe from '../models/informes.model.js';

async function getVentasPorProveedor(req: Request, res: Response, next: NextFunction) {
  try {
    const { desde, hasta } = req.query as { desde?: string; hasta?: string };
    const fechaDesde = desde ? new Date(desde) : undefined;
    const fechaHasta = hasta ? new Date(hasta) : undefined;

    if ((fechaDesde && isNaN(fechaDesde.getTime())) || (fechaHasta && isNaN(fechaHasta.getTime()))) {
      return res.status(400).json({ error: 'desde y hasta deben ser fechas válidas (AAAA-MM-DD)' });
    }

    res.status(200).json(await Informe.getVentasPorProveedor({ desde: fechaDesde, hasta: fechaHasta }));
  } catch (error) {
    next(error);
  }
}

export { getVentasPorProveedor };
