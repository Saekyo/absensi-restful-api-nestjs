import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { JwtMiddleware } from './middleware-auth/middleware-auth.middleware';
import { AnnouncementController } from './announcement/announcement.controller';
import { AttendancesModule } from './attendances/attendances.module';
import { AdminMiddleware } from './admin/admin.middleware';

@Module({
  imports: [PrismaModule, AuthModule, AnnouncementModule, AttendancesModule],
  controllers: [AppController, AnnouncementController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, AdminMiddleware)
      .forRoutes(
        'announcement/create',
        'announcement/update/:id',
        'announcement/delete/:id',
        'menu/create',
        'menu/update/:id',
        'menu/delete/:id',
      );
    consumer.apply(JwtMiddleware).exclude('auth/login');
  }
}
