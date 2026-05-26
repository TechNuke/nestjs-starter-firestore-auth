import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { FirebaseUser } from '../interfaces/firebase-user.interface';

@Injectable()
export class OptionalFirebaseAuthGuard extends AuthGuard('firebase') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  // Never throw — just attach user if token is valid
  handleRequest<T extends FirebaseUser>(
    _err: Error | null,
    user: T | false,
  ): T | null {
    return user || null;
  }
}
