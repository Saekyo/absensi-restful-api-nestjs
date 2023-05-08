import {
  Injectable,
  HttpException,
  HttpStatus,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Prisma } from '@prisma/client';
import { Request } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { insideCircle, headingDistanceTo } from 'geolocation-utils';
import { connect } from 'http2';
import { Status } from './dto/enum/status.enum';
import { status } from './status.enum';

@Injectable()
export class AttendancesService {
  constructor(private dbService: PrismaService) {}
  async createPresent(
    userId: number,
    lat1: number,
    lon1: number,
    status: Status,
  ) {
    const radius = 100; // meters
    const location1 = { lat: lat1, lon: lon1 };
    const lat2 = -6.6251028;
    const lon2 = 106.8122365;
    const lat3 = -6.627028;
    const lon3 = 106.814333;
    const location2 = { lat: lat2, lon: lon2 };
    const location3 = { lat: lat3, lon: lon3 };
    let circle = insideCircle(location2, location1, radius); // true
    let circle2 = insideCircle(location3, location1, radius);

    const now = new Date();
    console.log(circle);
    if (status == 'hadir') {
      if (circle == true) {
        const attendance = await this.dbService.attendances.create({
          data: {
            checkIn: now.toLocaleString(),
            status: status,
            user: { connect: { id: userId } },
          },
          // data: { ...dto, user: { connect: { id: userId } } }
        });
        if (attendance) {
          return {
            location: circle,
            statusCode: 200,
            message: 'Successfully Checkin',
          };
        }
      } else if (circle2 == true) {
        const attendance = await this.dbService.attendances.create({
          data: {
            checkIn: now.toLocaleString(),
            status: status,
            user: { connect: { id: userId } },
          },
          // data: { ...dto, user: { connect: { id: userId } } }
        });
        if (attendance) {
          return {
            location: circle2,
            statusCode: 200,
            message: 'Successfully Checkin',
          };
        }
      } else {
        return {
          stasusCode: 400,
          message: 'You Cant Access This On Your Location Right Now!',
        };
      }
    } else {
      return {
        statusCode: 450,
        message: 'You are not absent, please fill in correctly',
      };
    }
  }

  async createOthers(
    userId: number,
    photo: Express.Multer.File,
    status: Status,
    description: string,
    name: string,
  ) {
    const now = new Date();
    const url = `/image/${photo.originalname}`;
    if (status == 'sakit' || 'izin' || 'wfh') {
      const media = await this.dbService.medias.create({
        data: {
          path: url,
          name: name,
          type: 'attendances',
        },
      });
      const mediaId = media.id;

      const othersAttendances = await this.dbService.attendances.create({
        data: {
          status: status,
          checkIn: now.toLocaleString(),
          description: description,
          user: { connect: { id: userId } },
          media: { connect: { id: mediaId } },
        },
      });

      if (othersAttendances) {
        return {
          statusCode: 200,
          message: 'Success create Attendances!',
        };
      } else {
        return {
          statusCode: 409,
          message: 'You Cannot Add Attendances!',
        };
      }
    } else {
      return {
        statusCode: 400,
        message: 'You Cannot Add Attendances!',
      };
    }
  }

  async findAll() {
    const all = await this.dbService.attendances.findMany({
      include:{
        user: {
          select:{
            name: true
          }
        }
      }
    })

    return{
      status: 200,
      data :  all ?? []
    }
  }

  async checkout(id: number) {
    const now = new Date();
    const checkout = await this.dbService.attendances.update({
      where: { id },
      data: {
        checkOut: now.toLocaleDateString(),
      },
    });
    if (checkout) {
      return {
        statusCode: 200,
        message: 'Successfully Checkout',
      };
    }
    return `This action updates a #${id} attendance`;
  }

  async percentages(@Param() Param, userId: number) {
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

    const totalAttendances =
      statusHadir + statusAlfa + statusWfh + statusSakit + statusIzin;

    const hadir = (statusHadir / totalAttendances) * 100;
    const wfh = (statusAlfa / totalAttendances) * 100;
    const alfa = (statusHadir / totalAttendances) * 100;
    const sakit = (statusSakit / totalAttendances) * 100;
    const izin = (statusIzin / totalAttendances) * 100;

    // if (Param.status == 'hadir') {
    //   return hadir;
    // }
  }

  async profile(
    @UploadedFile() photo: Express.Multer.File,
    name: string,
    userId: number,
  ) {
    const url = `/image/${photo.originalname}`;

    const media = await this.dbService.medias.create({
      data: {
        path: url,
        name: name,
        type: 'profile',
      },
    });
    const user_id = userId;
    const mediaId = media.id;
    console.log(user_id);
    console.log('mediaId => ', mediaId);
    console.log('this.dbService.users => ', this.dbService.users);

    await this.dbService.users.update({
      where: { id: user_id },
      data: {
        mediaId: mediaId,
      },
    });

    return media;
  }

  async now() {
    const date = new Date();
    const now = date.toLocaleString();
    // Membuat objek Date untuk waktu saat ini

    // Membuat objek Date untuk batas akhir absen (jam 8 pagi)
    const deadline = new Date();
    deadline.setHours(8, 0, 0, 0);

    // Menghitung selisih waktu antara waktu saat ini dan batas akhir absen
    const timeDiff = deadline.getTime() - date.getTime();

    // Jika selisih waktu kurang dari nol, artinya batas akhir absen sudah berlalu
    if (timeDiff < 0) {
      return {
        statusCode: 400,
        message: "You're Already Late",
        now,
      };
    } else {
      // Mengubah selisih waktu menjadi satuan menit
      const hours = Math.floor(timeDiff / (1000 * 60 * 60)); // mengonversi selisih waktu menjadi jam
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)); // mengonversi selisih waktu menjadi menit
      return {
        statusCode: 200,
        checkInHours: `${hours}.${minutes} Hrs`,
        now,
      };
    }
  }

  async findUser(userId: number, id: number) {
    const { name } = await this.dbService.users.findFirst({
      where: { id },
    });
    // let findUserData = await this.dbService.users.findFirst({
    //   where: { id } 
    //   userData :
    // })
    const findOneUser = await this.dbService.attendances.findMany({
      where: { userId },
    });
    
    return {
      statusCode: 200,
      message: 'success',
      user: name ?? {},
      data: findOneUser ?? {},
    };
  }
  
}
