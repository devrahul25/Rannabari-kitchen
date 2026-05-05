import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'babos_kitchen_secret_2024_do_not_share';

export interface AuthRequest extends Request {
  adminId?: number;
}

export function authenticateAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number };
    req.adminId = payload.id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function generateToken(id: number): string {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
}
