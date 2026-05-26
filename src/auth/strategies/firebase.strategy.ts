import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { Strategy } from 'passport-custom';
import { FirebaseService } from '../../firebase/firebase.service';
import { FirebaseUser } from '../interfaces/firebase-user.interface';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  private readonly logger = new Logger(FirebaseStrategy.name);

  constructor(private readonly firebaseService: FirebaseService) {
    super();
  }

  async validate(request: Request): Promise<FirebaseUser> {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decodedToken: DecodedIdToken =
        await this.firebaseService.auth.verifyIdToken(token, true);

      const user = new FirebaseUser();
      user.uid = decodedToken.uid;
      user.email = decodedToken.email ?? '';
      user.emailVerified = decodedToken.email_verified ?? false;
      user.displayName = (decodedToken.name as string) ?? '';
      user.photoURL = (decodedToken.picture as string) ?? '';
      user.phoneNumber = (decodedToken.phone_number as string) ?? '';
      user.disabled = false;
      user.provider = decodedToken.firebase.sign_in_provider;
      user.customClaims = decodedToken;

      return user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Token verification failed: ${message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
