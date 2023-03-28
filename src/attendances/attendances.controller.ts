import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Req, UseGuards } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import {Status} from "./dto/enum/status.enum"
import { request } from 'http';
import {insideCircle, headingDistanceTo}  from 'geolocation-utils'

@UseGuards(JwtAuthGuard)
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post('/create')
  create(@Request() req, @Body('lat1') lat1: number, @Body('lon1') lon1: number,  @Body('status') status: Status, @Body('description') desctription: string){
    const userId = req.user.user_id
    if(status == "hadir"){
    return this.attendancesService.createPresent(userId, lat1, lon1,  status)
    }else{
      return this.attendancesService.createOthers(userId, status, lat1 || 0, lon1 || 0, desctription)
    }
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendancesService.findOne(+id);
  }

  @Patch('/checkout/:id')
  update(@Param('id') id: string) {
    return this.attendancesService.checkout(+id );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendancesService.remove(+id);
  }
}
