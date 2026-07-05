import { Request, Response, NextFunction } from 'express';

export function hasRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user_role || !roles.includes(req.user_role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
}
