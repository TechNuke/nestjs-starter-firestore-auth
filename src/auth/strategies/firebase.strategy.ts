import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { Strategy } from 'passport-custom';
import { FirebaseService } from '../../firebase/firebase.service';
import { FirebaseUser } from '../interfaces/firebase-user.interface';
import { FirebaseUserMapper } from '../mappers/firebase-user.mapper';

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

      const user: FirebaseUser =
        FirebaseUserMapper.fromDecodedToken(decodedToken);

      return user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Token verification failed: ${message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
