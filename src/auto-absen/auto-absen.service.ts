import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as schedule from 'node-schedule'
import { Status } from 'src/attendances/dto/enum/status.enum';
import { async, identity } from 'rxjs';

@Injectable()
export class AutoAbsen{
    constructor(
        private dbService: PrismaService,
    ){}
    async auto(){
        const today = new Date();
        const dayOfWeek = today.getDay();
        // if(dayOfWeek === 6 || dayOfWeek === 7 ){
            const now = new Date();
            // const attendance = await this.dbService.attendances.create({
            //     data: {
            //         checkIn: now.toLocaleString(),
            //         status: 'hadir',
            //         user: { connect: { id: userId } }
            //       }
            // })
            // return { attendance }

        const users = await this.dbService.users.findMany({
            select : {
                id: true
            }
        })
        const userIds = users.map(user => user.id);

         const result =   users.forEach(async users => {
             console.log(users.id);
             const data1 = await this.dbService.attendances.create({
                data: {
                    checkIn: now.toLocaleString(),
                    status: 'hadir',
                    user: { connect: { id: users.id } }
                  }
            })
            console.log(data1)
        })

        return { result }

        
            


        // return {
        //     statusCode: 200,
        //     message: 'success',
        //     data: userIds
        //   }     


        // }else{
            // return{
            //     status: 401,
            //     message: `Can't absent today`
            // }
        // }
    }
}