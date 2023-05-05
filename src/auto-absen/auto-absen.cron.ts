import { Cron, CronExpression } from '@nestjs/schedule';
import { Controller, Injectable, Post, Req, Request, UseGuards, Body } from '@nestjs/common';
import { AutoAbsen } from './auto-absen.service';
import { request } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';


@Injectable()
@UseGuards(JwtAuthGuard)
export class AbsenCron {
    constructor(private readonly autoAbsent : AutoAbsen, private dbService: PrismaService,
      ) { }  
  @Cron(`0 8 * * 6-7`, {
    timeZone: 'Asia/Jakarta',
  })
  
    async autoAbsen() {
   return this.autoAbsent.auto()
  } 
}
