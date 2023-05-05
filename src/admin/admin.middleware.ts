import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtConfig } from 'src/jwt.config';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Auth failed' });
    }
    try {
      interface JwtPayload {
        role: string;
        email: string;
        userId: number;
      }
      const decodedToken = jwt.verify(
        token,
        JwtConfig.user_secret,
      ) as JwtPayload;
      if (decodedToken.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = { email: decodedToken.email, userId: decodedToken.userId };
      next();
    } catch (err) {
      res.status(401).json({ message: 'Auth failed' });
    }
  }
}
