import { Controller, Get, Post, Body, Patch, Param, Delete,  UploadedFile } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService, private readonly dbService: PrismaService) {}
  

  @Post('/upload')
 
  async uploadProfile(@UploadedFile() photo: Express.Multer.File, @Body('name') name: string) {
    const url = `/image/${photo.originalname}`
    console.log(photo)
    const media = await this.dbService.medias.create({
      data: {
        path: url,
        name: name,
        type: 'profile'
      }
    })
    return media
  }

  @Get()
  findAll() {
    return this.mediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
