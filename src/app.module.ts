import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { JwtMiddleware } from './middleware-auth/middleware-auth.middleware';
import { AnnouncementController } from './announcement/announcement.controller';
import { AttendancesModule } from './attendances/attendances.module';
import { MediaModule } from './media/media.module';
import { MulterModule } from '@nestjs/platform-express/multer';
import { ScheduleModule } from '@nestjs/schedule';
import { AbsenCron  } from './auto-absen/auto-absen.cron';
import { AutoModule } from './auto-absen/auto-absen.module';


@Module({
  imports: [PrismaModule, AuthModule, AnnouncementModule, AttendancesModule, MediaModule, MulterModule.register({dest: '../files'}), ScheduleModule.forRoot(), AutoModule],
  controllers: [AppController, AnnouncementController],
  providers: [AppService],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(AnnouncementController)
  }
}

