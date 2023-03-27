import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private dbService: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    const createMenu = await this.dbService.menus.create({
      data: createMenuDto,
    });
    if (createMenu) {
      return {
        statusCode: 200,
        message: 'success',
      };
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  async findAll() {
    const biodataAll = await this.dbService.menus.findMany();
    return {
      statusCode: 200,
      message: 'success',
      data: biodataAll ?? [],
    };
  }

  async findOne(id: number) {
    const biodata = await this.dbService.menus.findFirst({ where: { id } });
    return {
      statusCode: 200,
      message: 'success',
      data: biodata ?? {},
    };
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const biodata = await this.dbService.menus.update({
      where: { id },
      data: updateMenuDto,
    });
    if (biodata) {
      return {
        statusCode: 200,
        message: 'success',
        data: biodata ?? {},
      };
    }
  }

  async remove(id: number) {
    const biodata = await this.dbService.menus.delete({ where: { id } });
    if (biodata) {
      return {
        statusCode: 200,
        message: 'success',
      };
    }
  }
}
