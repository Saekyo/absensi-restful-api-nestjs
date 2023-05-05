import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateMenuDto implements Prisma.menusCreateInput {
  @IsString()
  @IsNotEmpty()
  name: string;
}
