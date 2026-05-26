import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseUser } from './interfaces/firebase-user.interface';
import { FirebaseUserMapper } from './mappers/firebase-user.mapper';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async verifyToken(token: string): Promise<FirebaseUser> {
    try {
      const decodedToken: DecodedIdToken =
        await this.firebaseService.auth.verifyIdToken(token, true);
      const user: FirebaseUser =
        FirebaseUserMapper.fromDecodedToken(decodedToken);
      return user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Token verification error: ${message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async revokeToken(uid: string): Promise<void> {
    try {
      await this.firebaseService.auth.revokeRefreshTokens(uid);
      this.logger.log(`Tokens revoked for user: ${uid}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to revoke tokens: ${message}`);
      throw error;
    }
  }

  async setCustomClaims(
    uid: string,
    claims: Record<string, unknown>,
  ): Promise<void> {
    await this.firebaseService.auth.setCustomUserClaims(uid, claims);
    this.logger.log(`Custom claims set for user: ${uid}`);
  }
}
