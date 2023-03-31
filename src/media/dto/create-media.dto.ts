import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';
import { Types } from '../enum/types.enum';

export class CreateMediaDto implements Prisma.mediasCreateInput {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  path: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  type: Types;

  user: Prisma.usersCreateNestedOneWithoutAttendancesInput;
}
