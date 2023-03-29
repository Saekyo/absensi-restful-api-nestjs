import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class MediaService {
  constructor(
    private dbService: PrismaService,
  ) { }
  async create(dto: CreateMediaDto, photo: Express.Multer.File) {
  const url = `/image/${photo}`
   const uploadPhoto = await this.dbService.medias.create({
    data: {
      ...dto
    }
   })
  }

  findAll() {
    return `This action returns all media`;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
