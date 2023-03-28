import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Prisma, users } from '@prisma/client';


export class CreateAnnouncementDto implements Prisma.announcementsCreateInput {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    description: string

    user: Prisma.usersCreateNestedOneWithoutAnnouncementsInput;
}
