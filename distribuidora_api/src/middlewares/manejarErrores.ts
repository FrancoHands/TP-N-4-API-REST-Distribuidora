import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';

function manejarErrores(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El JSON enviado no es válido' });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe un registro con ese valor único' });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    if (err.code === 'P2003') {
      if (req.method === 'DELETE') {
        return res.status(409).json({ error: 'El registro tiene recursos relacionados' });
      }
      return res.status(400).json({ error: 'Alguno de los ids enviados no existe' });
    }

    if (err.code === 'P2000' || err.code === 'P2020' || err.code === 'P2039') {
      return res.status(400).json({ error: 'Alguno de los valores está fuera de rango' });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ error: 'Los datos enviados no son válidos' });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
}

export default manejarErrores;
