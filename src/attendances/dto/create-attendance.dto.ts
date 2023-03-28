import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmpty } from "class-validator";
import { Prisma, } from '@prisma/client';
import { Status } from "./enum/status.enum";

export class CreateAttendanceDto implements Prisma.attendancesCreateInput {

    @IsNotEmpty()
    @ApiProperty()
    date: Date
    
    @IsEmpty()
    @IsString()
    checkIn: string

    @IsEmpty()
    @IsString()
    checkOut: string
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    status: Status


    @IsString()
    @IsEmpty()
    description: string


    user: Prisma.usersCreateNestedOneWithoutAttendancesInput;
    media?: Prisma.mediasCreateNestedOneWithoutAttendancesInput;
}