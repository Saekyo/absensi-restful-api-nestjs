import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import jwt from 'jsonwebtoken';
import { JwtConfig } from 'src/jwt.config';

@UseGuards(JwtAuthGuard)
@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post('/create')
  create(@Body() createAnnouncementDto: CreateAnnouncementDto, @Request() req) {
    const userId = req.user.user_id;
    return this.announcementService.create(createAnnouncementDto, userId);
  }

  @Get('/show')
  findAll() {
    return this.announcementService.findAll();
  }

  @Get('/show/:id')
  findOne(@Param('id') id: string) {
    return this.announcementService.findOne(+id);
  }

  @Get('/how/:userId')
  findUser(@Param('userId') id: string, @Request() req) {
    const userId = req.user.user_id;
    return this.announcementService.findUser(+id, +userId);
  }

  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementService.update(+id, updateAnnouncementDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.announcementService.delete(+id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('/test')
  // test(@Req() req){
  //   const authHeader = req.headers['authorization'];

  //   const token = req.headers.authorization.split(' ')[1];
  //   jwt.verify(token, JwtConfig.user_secret, (err, payload) => {
  //     if (err) {
  //       return console.log(err)
  //     } else {
  //       return console.log(payload)
  //     }
  //   }
  //   )

  // }
}
