import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { Status } from './dto/enum/status.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { request } from 'http';
import { attendances } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { insideCircle, headingDistanceTo } from 'geolocation-utils';
import { Multer } from 'multer';
import { users } from '@prisma/client';
import { use } from 'passport';
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './image/',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
  }),
)
@UseGuards(JwtAuthGuard)
@Controller('attendances')
export class AttendancesController {
  constructor(
    private readonly attendancesService: AttendancesService,
    private readonly dbService: PrismaService,
  ) {}

  @Post('/create')
  async createPresences(
    @Request() req,
    @Body('lat1') lat1: number,
    @Body('lon1') lon1: number,
    @Body('status') status: Status,
  ) {
    const userId = req.user.user_id;
    return this.attendancesService.createPresent(userId, lat1, lon1, status);
  }

  @Post('/create/other')
  async createOthers(
    @Request() req,
    @UploadedFile() photo: Express.Multer.File,
    @Body('status') status: Status,
    @Body('description') description: string,
    @Body('name') name: string,
  ) {
    const userId = req.user.user_id;
    // const { id: mediaId }  =  await this.dbService.medias.findFirst({ where: {path: medias.path } })
    return this.attendancesService.createOthers(
      userId,
      photo,
      status,
      description,
      name,
    );
  }
  @Post('/upload/profile')
  async uploadProfile(
    @UploadedFile() photo: Express.Multer.File,
    @Body('name') name: string,
    @Request() req,
  ) {
    const { user_id } = req.user;
    return this.attendancesService.profile(photo, name, user_id);
  }

  @Patch('/checkout/:id')
  update(@Param('id') id: string) {
    return this.attendancesService.checkout(+id);
  }

  @Get('/home')
  async home(@Request() req, id: number) {
    const { id: user_id } = req.user;
    const attendanceData = await this.dbService.attendances.findFirst({
      where: {
        userId: user_id,
      },
    });
    const username = await this.dbService.users.findFirst({
      where: { id: user_id },
    });
    const name = username.name;
    // return console.log(attendanceData);

    // const profile = await this.dbService.attendances.findFirst({
    //   where: {},
    // });
    // const username = await this.dbService.users.findFirst({
    //   where: { id: userId },
    // });
    const profile = await this.dbService.medias.findFirst({
      where: {
        id,
      },
    });
    const pict = profile.path;
    const announcementData = await this.dbService.announcements.findMany({
      where: {
        userId: user_id,
      },
    });

    return {
      pict,
      name,
      attendance: attendanceData,
      announcement: announcementData,
    };
  }
  @Get('/checkIn')
  async attendance(@Request() req) {
    const { id: user_id } = req.user;

    const username = await this.dbService.users.findFirst({
      where: { id: user_id },
    });
    const time = await this.attendancesService.now();
    const name = username.name;
    return {
      time,
      name,
    };
  }

  @Get('/profile')
  async profile(@Request() req, id: number) {
    const { id: user_id } = req.user;
    const user = await this.dbService.users.findFirst({
      where: { id: user_id },
    });
    const profile = await this.dbService.medias.findFirst({
      where: {
        id,
      },
    });
    const pict = profile.path;
    const name = user.name;
    const email = user.email;

    return {
      pict,
      name,
      email,
    };
  }

  @Get('/admin/profile')
  async profileData(@Request() req) {
    const { id: user_id } = req.user;
    const user = await this.dbService.users.findFirst({
      where: { id: user_id },
    });
    const name = user.name;
    const attendance = await this.dbService.attendances.findMany();
    return {
      name,
      attendance,
    };
  }
  @Get('/admin/data')
  async data() {
    const user = await this.dbService.users.findMany();
    return {
      user,
    };
  }
  @Get('/admin/data/:userId')
  findUser(@Param('userId') id: string, @Request() req) {
    const userId = req.user.user_id;
    return this.attendancesService.findUser(+id, +userId);
  }
}
