import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AbsenCron } from './auto-absen.cron';
import { AutoAbsen } from './auto-absen.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [AutoAbsen],
})
export class AutoModule {}
