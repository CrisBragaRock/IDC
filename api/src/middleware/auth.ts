import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { JwtPayload, Role, User } from '../types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const { rows } = await db.query<User>('SELECT * FROM users WHERE id = $1', [payload.userId]);
    const user = rows[0];
    if (!user || (user.pw_version ?? 0) !== (payload.pwv ?? 0)) {
      res.status(401).json({ error: 'Session expired' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
}
