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
import { PrismaService } from 'src/prisma/prisma.service';
import { insideCircle, headingDistanceTo } from 'geolocation-utils';
import { Multer } from 'multer';
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
  ) {
    const url = `/image/${photo.originalname}`;

    const media = await this.dbService.medias.create({
      data: {
        path: url,
        name: name,
        type: 'profile',
      },
    });
    return media;
  }

  @Patch('/checkout/:id')
  update(@Param('id') id: string) {
    return this.attendancesService.checkout(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendancesService.remove(+id);
  }
}
