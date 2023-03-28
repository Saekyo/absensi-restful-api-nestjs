import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtConfig } from '../jwt.config';

 
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
 
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }
 
    const token = authHeader.split(' ')[1];
 
    try {
      const decodedToken = jwt.verify(token, JwtConfig.user_secret);
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}