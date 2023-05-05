import { Controller, Get } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('route')
export class RouteController {
  constructor(private dbService: PrismaService) {}
}
