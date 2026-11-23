import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiException } from '../common/exception/api.exception.js';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();

    const message =
      typeof body === 'string'
        ? body
        : (body as { message: string | string[] }).message;

    // 7주차 추가: ApiException이면 사용자 정의 에러 코드 사용
    const code =
      exception instanceof ApiException ? exception.code : 'COMMON' + status;

    response.status(status).json({
      isSuccess: false,
      code,
      message: Array.isArray(message) ? message[0] : message,
      result: null,
    });
  }
}
