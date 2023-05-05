import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Post('')
  @UsePipes(ValidationPipe)
  async create(@Body() createMenuDto: CreateMenuDto) {
    return await this.menuService.create(createMenuDto);
  }

  @Get('/data')
  async findAll() {
    return await this.menuService.findAll();
  }

  @Get('/data:id')
  async findOne(@Param('id') id: string) {
    return await this.menuService.findOne(+id);
  }

  @Patch('/update:id')
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return await this.menuService.update(+id, updateMenuDto);
  }

  @Delete('/delete:id')
  async remove(@Param('id') id: string) {
    return await this.menuService.remove(+id);
  }
}
