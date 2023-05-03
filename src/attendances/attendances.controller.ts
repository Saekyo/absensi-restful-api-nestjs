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
  @Get('/precentage')
  async precentage(@Param('status') status: string ,@Request() request, userId: number){
    const findOneUser = await this.dbService.attendances.findMany({
      where: { userId },
    });
    const statusHadir = findOneUser.filter(
      (item) => item.status == 'hadir',
    ).length;
    const statusAlfa = findOneUser.filter(
      (item) => item.status == 'alfa',
    ).length;
    const statusIzin = findOneUser.filter(
      (item) => item.status == 'izin',
    ).length;
    const statusWfh = findOneUser.filter((item) => item.status == 'wfh').length;
    const statusSakit = findOneUser.filter(
      (item) => item.status == 'sakit',
    ).length;

  let totalAttendance = 0;
  let percentages = 0;

  switch(status) {
    case 'hadir':
      totalAttendance = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
      percentages = (statusHadir / totalAttendance) * 100;
      break;
    case 'alfa':
      totalAttendance = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
      percentages = (statusAlfa / totalAttendance) * 100;
      break;
    case 'izin':
      totalAttendance = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
      percentages = (statusIzin / totalAttendance) * 100;
      break;
    case 'wfh':
      totalAttendance = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
      percentages = (statusWfh / totalAttendance) * 100;
      break;
    case 'sakit':
      totalAttendance = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
      percentages = (statusSakit / totalAttendance) * 100;
      
      break;
    default:
      totalAttendance = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
      percentages = 0;
  }

  console.log(`Percentages ${status}: ${percentages}%`);

    const totalAttendances =
      statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
      const percentage = {
        hadir: (statusHadir / totalAttendances) * 100,
        alfa: (statusAlfa / totalAttendances) * 100,
        izin: (statusIzin / totalAttendances) * 100,
        wfh: (statusWfh / totalAttendances) * 100,
        sakit: (statusSakit / totalAttendances) * 100,
      };
    
      return { percentage };
    // console.log(findOneUser.reduce((a, b) => a + b['Status']));
  }
  @Get('/precentage/status/:status')
async precentages(@Param('status') status: string) {
  const findAllUsers = await this.dbService.attendances.findMany();

  const statusHadir = findAllUsers.filter((item) => item.status === 'hadir').length;
  const statusAlfa = findAllUsers.filter((item) => item.status === 'alfa').length;
  const statusIzin = findAllUsers.filter((item) => item.status === 'izin').length;
  const statusWfh = findAllUsers.filter((item) => item.status === 'wfh').length;
  const statusSakit = findAllUsers.filter((item) => item.status === 'sakit').length;

  let totalAttendances = 0;
  let percentage = 0;
  let rounded

  switch (status) {
    case 'hadir':
      totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
      percentage = (statusHadir / totalAttendances) * 100;
      rounded = Math.floor(percentage)

      break;
    case 'alfa':
      totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
      percentage = (statusAlfa / totalAttendances) * 100;
      rounded = Math.floor(percentage)

      break;
    case 'izin':
      totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
      percentage = (statusIzin / totalAttendances) * 100;
      rounded = Math.floor(percentage)

      break;
    case 'wfh':
      totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
      percentage = (statusWfh / totalAttendances) * 100;
      rounded = Math.floor(percentage)

      break;
    case 'sakit':
      totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
      percentage = (statusSakit / totalAttendances) * 100;
      rounded = Math.floor(percentage)
      break;
    default:
      totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
      percentage = 0;
  }

  return{
    message: `Percentage ${status}: ${rounded}%`
  }
}
}
