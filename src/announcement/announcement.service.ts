import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

// import jwt from 'jsonwebtoken';


@Injectable()
export class AnnouncementService {
  constructor(
    private dbService: PrismaService,
  ) { }
  async create(dto: Prisma.announcementsCreateInput, userId: number) {  
    let createAnnoun = await this.dbService.announcements.create({
      data: { ...dto, user: { connect: { id: userId } } }
    })
    if (createAnnoun) {
      return {
        status: 200,
        message: 'Announcement created'
      }
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

  }

  async findAll() {
    let findAllAnnoun = await this.dbService.announcements.findMany()
    return {
      statusCode: 200,
      message: 'success',
      data: findAllAnnoun ?? []
    }
  }

  async findOne(id: number) {
    let findOneAnnoun = await this.dbService.announcements.findFirst({
      where: { id }
    })
    return {
      statusCode: 200,
      message: 'success',
      data: findOneAnnoun ?? {}
    }         
  }
  async findUser(userId: number, id :number) {
    const { name } = await this.dbService.users.findFirst({
      where: { id },
    })
    // let findUserData = await this.dbService.users.findFirst({
    //   where: { id }
    //   userData : 
    // })
    let findOneUser = await this.dbService.announcements.findFirst({
      where: { userId }
    })
    return {
      statusCode: 200,
      message: 'success',
      user: name ?? {},
      data: findOneUser ?? {}
    }         
  }

  async update(id: number, dto: UpdateAnnouncementDto) {
    let updateAnnoun = await this.dbService.announcements.update({
      where: { id },
      data: dto
    })
    if (updateAnnoun) {
      return {
        status: 200,
        message: 'Announcements Updated',
        data: updateAnnoun ?? {}
      }
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
  }

  async delete(id: number) {
    let deleteAnnoun = await this.dbService.announcements.delete({
      where: { id }
    })

    if (deleteAnnoun) {
      return {
        status: 200,
        message: 'Success Delete'
      }
    }
  }
}
