import type { NextFunction, Request, Response } from 'express';

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userid;

  if (!userId) {
    res.redirect('/login');
  }

  next();
}
