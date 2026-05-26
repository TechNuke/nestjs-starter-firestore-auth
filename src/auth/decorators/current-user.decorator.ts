import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseUser } from '../interfaces/firebase-user.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): FirebaseUser => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: FirebaseUser }>();
    return request.user;
  },
);
