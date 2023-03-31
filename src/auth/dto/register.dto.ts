import { ApiProperty } from '@nestjs/swagger';
import { Gender, Prisma } from '@prisma/client';
import { IsEmpty, IsNotEmpty } from 'class-validator';

export class RegisterDto implements Prisma.usersCreateInput {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phone_num: string;

  @ApiProperty()
  @IsEmpty()
  mediaId: number;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  media?: Prisma.mediasCreateNestedOneWithoutAttendancesInput;
}
