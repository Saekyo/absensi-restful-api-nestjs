import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Req, UseGuards, UseInterceptors, UploadedFile, Query, ParseIntPipe } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { Status } from "./dto/enum/status.enum"
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { request } from 'http';
import { insideCircle, headingDistanceTo } from 'geolocation-utils'
import { PrismaService } from 'src/prisma/prisma.service';
import { use } from 'passport';
import * as _ from 'lodash';
import { count, log } from 'console';



@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './image/',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname)
      const filename = `${file.originalname}-${uniqueSuffix}${ext}`
      callback(null, filename)
    }
  })
}))
@UseGuards(JwtAuthGuard)
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService, private readonly dbService: PrismaService) { }

  @Post('/create')
  async createPresences(@Request() req, @Body('lat1') lat1: number, @Body('lon1') lon1: number, @Body('status') status: Status) {
    const userId = req.user.user_id
    return this.attendancesService.createPresent(userId, lat1, lon1, status)
  }

  @Post('/create/other')
  async createOthers(@Request() req, @UploadedFile() photo: Express.Multer.File, @Body('status') status: Status, @Body('description') description: string, @Body('name') name: string) {
    const userId = req.user.user_id
    // const { id: mediaId }  =  await this.dbService.medias.findFirst({ where: {path: medias.path } })
    return this.attendancesService.createOthers(userId, photo, status, description, name)
  }


  @Post('/upload/profile')
  async uploadProfile(@UploadedFile() photo: Express.Multer.File, @Body('name') name: string) {
    const url = `/image/${photo.originalname}`

    const media = await this.dbService.medias.create({
      data: {
        path: url,
        name: name,
        type: 'profile'
      }
    })
    return media
  }

  @Get('/show')
  async getAttendances() {
    return this.attendancesService.findAll()
  }

  @Get('/percentage/:userId')
  async percentageUser(@Request() request, @Param('userId', ParseIntPipe) userId: number, status) {
    const findOneUser = await this.dbService.attendances.findMany({
      where: { userId: userId },
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

    const totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
    let percentage = 0;

    const hadir = Math.round((statusHadir / totalAttendances) * 100);
    const alfa = Math.round((statusAlfa / totalAttendances) * 100);
    const izin = Math.round((statusIzin / totalAttendances) * 100);
    const wfh = Math.round((statusWfh / totalAttendances) * 100);
    const sakit = Math.round((statusSakit / totalAttendances) * 100);

    const hadirPercentage = `${hadir}%`
    const alfaPercentage = `${alfa}%`
    const izinPercentage = `${izin}%`
    const wfhPercentage = `${wfh}%`
    const sakitPercentage = `${sakit}%`




    switch (status) {
      case 'hadir':
        hadirPercentage
        break;
      case 'alfa':
        alfaPercentage
        break;
      case 'izin':
        izinPercentage
        break;
      case 'wfh':
        wfhPercentage
        break;
      case 'sakit':
        sakitPercentage
        break;
      default:
        percentage = 0;
    }
    const Allpercentage = {
      hadir: hadirPercentage,
      alfa: alfaPercentage,
      izin: izinPercentage,
      wfh: wfhPercentage,
      sakit: sakitPercentage,
    };




    return {
      Allpercentage
    };
  }

  @Get('/percentage')
  async persentage(@Request() request, @Query('userId') userId: number, status) {
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

    const totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
    let percentage = 0;

    const hadir = Math.round((statusHadir / totalAttendances) * 100);
    const alfa = Math.round((statusAlfa / totalAttendances) * 100);
    const izin = Math.round((statusIzin / totalAttendances) * 100);
    const wfh = Math.round((statusWfh / totalAttendances) * 100);
    const sakit = Math.round((statusSakit / totalAttendances) * 100);

    const hadirPercentage = `${hadir}%`
    const alfaPercentage = `${alfa}%`
    const izinPercentage = `${izin}%`
    const wfhPercentage = `${wfh}%`
    const sakitPercentage = `${sakit}%`




    switch (status) {
      case 'hadir':
        hadirPercentage
        break;
      case 'alfa':
        alfaPercentage
        break;
      case 'izin':
        izinPercentage
        break;
      case 'wfh':
        wfhPercentage
        break;
      case 'sakit':
        sakitPercentage
        break;
      default:
        percentage = 0;
    }
    const Allpercentage = {
      hadir: hadirPercentage,
      alfa: alfaPercentage,
      izin: izinPercentage,
      wfh: wfhPercentage,
      sakit: sakitPercentage,
    };




    return {
      Allpercentage
    };
  }

  @Get('/percentage/status/:status')
  async precentage(@Param('status') status: string, @Query('userId') userId: number) {
    const findOneUsers = await this.dbService.attendances.findMany({
      where: { userId: userId }
    })


    const findAllUsers = await this.dbService.attendances.findMany();

    const statusHadir = findAllUsers.filter((item) => item.status === 'hadir').length;
    const statusAlfa = findAllUsers.filter((item) => item.status === 'alfa').length;
    const statusIzin = findAllUsers.filter((item) => item.status === 'izin').length;
    const statusWfh = findAllUsers.filter((item) => item.status === 'wfh').length;
    const statusSakit = findAllUsers.filter((item) => item.status === 'sakit').length;

    let totalAttendances = 0;
    let percentage = 0;
    let bulat = 0;
    let output = '';

    switch (status) {
      case 'hadir':
        totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
        percentage = (statusHadir / totalAttendances) * 100;
        bulat = Math.round(percentage)
        output = `${bulat}%`
        break;
      case 'alfa':
        totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
        percentage = (statusAlfa / totalAttendances) * 100;
        bulat = Math.round(percentage)
        output = `${bulat}%`
        break;
      case 'izin':
        totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
        percentage = (statusIzin / totalAttendances) * 100;
        bulat = Math.round(percentage)
        output = `${bulat}%`
        break;
      case 'wfh':
        totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
        percentage = (statusWfh / totalAttendances) * 100;
        bulat = Math.round(percentage)
        output = `${bulat}%`
        break;
      case 'sakit':
        totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
        percentage = (statusSakit / totalAttendances) * 100;
        bulat = Math.round(percentage)
        output = `${bulat}%`
        break;
      default:
        totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
        percentage = 0;
        bulat = Math.round(percentage)
        output = `${bulat}%`
    }

    return {
      message: output
    }
  }

  @Get('/percentage/status/:status')
  async precentageUser(@Param('status') status: string, @Query('userId', ParseIntPipe) userId: number) {
    const findAllUsers = await this.dbService.attendances.findMany();

    const statusHadir = findAllUsers.filter((item) => item.status === 'hadir').length;
    const statusAlfa = findAllUsers.filter((item) => item.status === 'alfa').length;
    const statusIzin = findAllUsers.filter((item) => item.status === 'izin').length;
    const statusWfh = findAllUsers.filter((item) => item.status === 'wfh').length;
    const statusSakit = findAllUsers.filter((item) => item.status === 'sakit').length;

    let totalAttendances = 0;
    let percentage = 0;
    let bulat = 0;
    let output = '';

    switch (status) {
      case 'hadir':
        totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
        percentage = (statusHadir / totalAttendances) * 100;
        bulat = Math.round(percentage)
        output = `${bulat}%`
        break;
      case 'alfa':
        totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
        percentage = (statusAlfa / totalAttendances) * 100;
        bulat = Math.round(percentage)
        output = `${bulat}%`
        break;
      case 'izin':
        totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
        percentage = (statusIzin / totalAttendances) * 100;
        bulat = Math.round(percentage)
        output = `${bulat}%`
        break;
      case 'wfh':
        totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
        percentage = (statusWfh / totalAttendances) * 100;
        bulat = Math.round(percentage)
        output = `${bulat}%`
        break;
      case 'sakit':
        totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
        percentage = (statusSakit / totalAttendances) * 100;
        bulat = Math.round(percentage)
        output = `${bulat}%`
        break;
      default:
        totalAttendances = statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;
        percentage = 0;
        bulat = Math.round(percentage)
        output = `${bulat}%`
    }

    return {
      message: output
    }
  }

  @Get('/presentage')
  async pesentage() {
    const users = await this.dbService.users.findMany({

      include: {
        attendances: {
          select: {
            status: true,
          }, 
          orderBy:{
            status: 'asc'
          }
        }
      }
    })

    const result = users.map(({name, attendances }) => {
      
      const persen = {}
      let total = 0;
      const attLen = attendances.length
      attendances.forEach(({ status }, index) => {
        total += 1;
        if (persen[status] === undefined) {
          persen[status] = 1;
        } else {
          persen[status] += 1;
        }

       
      })
    
      Object.keys(persen).forEach(status => {
        persen[status] = ((persen[status] / total) * 100).toFixed(2) + "%";
      });

      ['hadir', 'izin', 'sakit', 'alpa'].forEach(status => {
        if (!persen[status]) {
          persen[status] = '0.00%';
        }
      });
    
      return { name, persen };
    });

      

    return result

    
    


    //   const groupedAttendance = _.groupBy(attendanceArray, 'name', count);

    //   return console.log(groupedAttendance)
    // // console.log(groupedAttendanceArray);
    // //   return console.log(attendanceArray);



    // const attendanceByUserId = await this.dbService.attendances.groupBy({
    //   by: ['userId', 'status'],
    //   _count: true, // Menggunakan "count" daripada "_count"
    //   orderBy: {
    //     userId: 'asc',
    //   },
    // });
    // console.log(attendanceByUserId)
    // const userMap = await this.dbService.users.findMany()

    // const attendancePercentageByUserId = attendanceByUserId.reduce((result, attendances) => {
    //   console.log(result)

    //   const { userId, status, _count } = attendances; // Menggunakan "_count" dan "user" daripada "__count" dan "user"
    //   const index = result.findIndex(item => item.userId === userId);

    //   if (index > -1) {
    //     result[index].percentage[status] = `${Math.floor((_count / result[index].total) * 100).toFixed(2)}%`;
    //   } else {
    //     result.push({
    //       userId,
    //       total: _count,
    //       percentage: { [status]: `${Math.floor((_count / _count) * 100).toFixed(2)}%` }
    //     });
    //   }

    //   return result;
    // }, []);

    // attendancePercentageByUserId.forEach(async attendances => {
    //   let totalPercentage = 0;
    //   Object.entries(attendances.percentage).forEach(([status, percentage]) => {
    //     totalPercentage += parseFloat(percentage as string);
    //   });

    //   // Mengecek apakah total persentase sama dengan 100%
    //   if (totalPercentage !== 100) {
    //     Object.entries(attendances.percentage).forEach(([status, percentage]) => {
    //       attendances.percentage[status] = `${((parseFloat(percentage as string) / totalPercentage) * 100).toFixed(2)}%`;
    //     });
    //   }
    // });

    // return {
    //   attendancePercentageByUserId
    // };
  }

}


