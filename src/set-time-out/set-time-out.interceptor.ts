import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor{

  intercept(context: ExecutionContext, next: CallHandler) {
    const response = context.switchToHttp().getResponse()

    response.setTimeout(0)
    return next.handle()
  }
}