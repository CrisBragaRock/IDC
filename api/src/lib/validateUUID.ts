import { Request, Response, NextFunction } from 'express';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateUUID(paramName = 'id') {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!UUID_RE.test(req.params[paramName])) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }
    next();
  };
}
