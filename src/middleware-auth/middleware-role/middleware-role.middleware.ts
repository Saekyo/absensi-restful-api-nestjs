import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JwtConfig } from 'src/jwt.config';


@Injectable()
export class MiddlewareRole implements NestMiddleware {
  constructor(private prisma: PrismaClient) {}

  async use(req: Request, res: Response, next: () => void) {
    const authHeader = req.headers.authorization;
if (!authHeader) {
  throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
}

const token = authHeader.split(' ')[1];
let decodedToken: any;
try {
  decodedToken = verify(token, JwtConfig.user_secret);
} catch (err) {
  throw new HttpException('Invalid token.', HttpStatus.UNAUTHORIZED);
}
const user = await this.prisma.users.findUnique({
  where: {
    id: decodedToken.userId,
  },
});

if (user.role !== 'admin' && user.role !== 'user') {
  throw new HttpException('Forbidden.', HttpStatus.FORBIDDEN);
}

if (user.role === 'admin' && req.baseUrl.includes('/user')) {
  return next();
}


}
}