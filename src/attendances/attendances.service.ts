import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Prisma, } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {insideCircle, headingDistanceTo}  from 'geolocation-utils'
import { connect } from 'http2';
import {Status} from "./dto/enum/status.enum"



@Injectable()
export class AttendancesService {
  constructor(
    private dbService: PrismaService,
  ) { }
  async createPresent(lat1: number, lon1: number, userId: number, status: Status) {
    const radius = 10000 // meters
    const location1 = { lat: lat1, lon: lon1}
    const lat2 =  -6.6251028
    const lon2 = 106.8122365
    const location2 = { lat: lat2, lon: lon2 }
    let circle = insideCircle(location2, location1, radius) // true

    const now = new Date();
    if(circle == true){    
      const attendance = await this.dbService.attendances.create({
        data: {
          checkIn: now.toLocaleString(),
          status: status,
          user: { connect: { id: userId } }
        }
        // data: { ...dto, user: { connect: { id: userId } } }
      }) 
      if(attendance){
        return {
          location: circle,
          statusCode: 200,
          message: "Success isi 2"
        }
      }
    }else{
      return {
        message : "You Cant Access This On Your Location Right Now!"
      }
    }

  }

  async createOthers(userId: number, status: Status,  lat1: number, lon1: number, description: string){
    const now = new Date();
    const othersAttendances = await this.dbService.attendances.create({
      data: {
        status: status,
        description: description,
        checkIn: now.toLocaleString(),
        user: { connect: { id: userId } }
      }
    })

    if(othersAttendances){
      return {
        statusCode: 200,
        message: "Success isi 2"
      }
    }else{
      return{ 
        statusCode: 409,
        message: "You Cannot Add Attendances"
      }
    }
  }

  

  findOne(id: number) {
    return `This action returns a #${id} attendance`;
  }

  async checkout(id: number) {
    const now = new Date();
    const checkout = await this.dbService.attendances.update({
      where : {id},
      data:{
        checkOut : now.toLocaleDateString()
      }
    })
    if(checkout){
      return {
        statusCode: 200,
        message : "Successfully Checkout"
      }
    }
    return `This action updates a #${id} attendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }
}
