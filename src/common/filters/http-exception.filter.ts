import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

interface ExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage = 'Something went wrong';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse;
      } else {
        const typed = exceptionResponse as ExceptionResponse;
        if (Array.isArray(typed.message)) {
          errorMessage = typed.message.join(', ');
        } else {
          errorMessage = typed.message ?? typed.error ?? errorMessage;
        }
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${errorMessage}`,
    );

    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
