import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseUser } from './interfaces/firebase-user.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async verifyToken(token: string): Promise<FirebaseUser> {
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
