import type { NextFunction, Request, Response } from 'express';

function validarId(req: Request, res: Response, next: NextFunction) {
  if (!Number.isInteger(Number(req.params.id))) {
    return res.status(400).json({ error: 'El id debe ser un número entero' });
  }
  next();
}

export default validarId;
