import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ClientException } from './errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx       = host.switchToHttp();
    const response  = ctx.getResponse<Response>();
    const request   = ctx.getRequest<Request>();

    // Default status code: If exception is HttpException, take its status, otherwise 500
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const code =
      exception instanceof ClientException
        ? exception.code
        : "unknown error";

    // Prepare error response structure
    let errorResponse: any = {
      timestamp: new Date().toISOString(),
      path: request.url,
      errorCode: code,
      message: 'Internal server error',
    };

    // If exception is HttpException, take out error content
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      // If ClientException response structure is { errorCode, message }, combine directly
      if (typeof res === 'object' && res !== null) {
        errorResponse = {
          ...errorResponse,
          ...res,
        };
      } else {
        // If string, assign directly to message
        errorResponse.message = res;
      }
    } else if (exception instanceof Error) {
      // Other Error types
      errorResponse.message = exception.message;
    } else {
      errorResponse.message = String(exception);
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.status(status).send("internal server error");
    } else {
      response.status(status).json(errorResponse);
    }
  }
}

