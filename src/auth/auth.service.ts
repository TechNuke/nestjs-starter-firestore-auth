import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseService } from '../firebase/firebase.service';
import {
  FirebaseErrorResponse,
  FirebaseRefreshResponse,
  FirebaseSignInResponse,
  LoginResponse,
  RefreshResponse,
} from './interfaces/auth-response.interface';
import { FirebaseUser } from './interfaces/firebase-user.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly firebaseAuthUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts';
  private readonly firebaseTokenUrl =
    'https://securetoken.googleapis.com/v1/token';

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,
  ) {}

  private get webApiKey(): string {
    const key = this.configService.get<string>('firebase.webApiKey');
    if (!key) {
      throw new Error('FIREBASE_WEB_API_KEY is not configured');
    }
    return key;
  }

  private buildFirebaseUser(decodedToken: DecodedIdToken): FirebaseUser {
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
  }

  private handleFirebaseRestError(error: unknown): never {
    if (error instanceof AxiosError) {
      const data = error.response?.data as FirebaseErrorResponse | undefined;
      const message = data?.error?.message ?? 'Firebase error';

      const errorMap: Record<string, string> = {
        EMAIL_NOT_FOUND: 'No account found with this email',
        INVALID_PASSWORD: 'Incorrect password',
        INVALID_LOGIN_CREDENTIALS: 'Invalid email or password',
        USER_DISABLED: 'This account has been disabled',
        EMAIL_EXISTS: 'An account with this email already exists',
        WEAK_PASSWORD: 'Password must be at least 6 characters',
        TOO_MANY_ATTEMPTS_TRY_LATER:
          'Too many failed attempts. Please try again later',
        INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
        TOKEN_EXPIRED: 'Session expired. Please login again',
      };

      const friendlyMessage = errorMap[message] ?? message;

      if (
        message === 'EMAIL_NOT_FOUND' ||
        message === 'INVALID_PASSWORD' ||
        message === 'INVALID_LOGIN_CREDENTIALS' ||
        message === 'INVALID_REFRESH_TOKEN' ||
        message === 'TOKEN_EXPIRED'
      ) {
        throw new UnauthorizedException(friendlyMessage);
      }

      throw new BadRequestException(friendlyMessage);
    }

    throw new BadRequestException('Authentication failed');
  }

  // ─── Login ──────────────────────────────────────────────────

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post<FirebaseSignInResponse>(
        `${this.firebaseAuthUrl}:signInWithPassword?key=${this.webApiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        },
      );

      const { idToken, refreshToken, expiresIn } = response.data;

      const decodedToken: DecodedIdToken =
        await this.firebaseService.auth.verifyIdToken(idToken, true);

      const user = this.buildFirebaseUser(decodedToken);

      return { user, idToken, refreshToken, expiresIn };
    } catch (error: unknown) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.handleFirebaseRestError(error);
    }
  }

  // ─── Register ────────────────────────────────────────────────

  async register(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<LoginResponse> {
    try {
      const response = await axios.post<FirebaseSignInResponse>(
        `${this.firebaseAuthUrl}:signUp?key=${this.webApiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        },
      );

      const { idToken, refreshToken, expiresIn, localId } = response.data;

      // Update display name if provided
      if (displayName) {
        await this.firebaseService.auth.updateUser(localId, {
          displayName,
        });
      }

      const decodedToken: DecodedIdToken =
        await this.firebaseService.auth.verifyIdToken(idToken);

      const user = this.buildFirebaseUser(decodedToken);

      if (displayName) {
        user.displayName = displayName;
      }

      return { user, idToken, refreshToken, expiresIn };
    } catch (error: unknown) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.handleFirebaseRestError(error);
    }
  }

  // ─── Refresh Token ───────────────────────────────────────────

  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    try {
      const response = await axios.post<FirebaseRefreshResponse>(
        `${this.firebaseTokenUrl}?key=${this.webApiKey}`,
        {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        },
      );

      const { id_token, refresh_token, expires_in } = response.data;

      return {
        idToken: id_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
      };
    } catch (error: unknown) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.handleFirebaseRestError(error);
    }
  }

  // ─── Forgot Password ─────────────────────────────────────────

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      await axios.post(
        `${this.firebaseAuthUrl}:sendOobCode?key=${this.webApiKey}`,
        {
          requestType: 'PASSWORD_RESET',
          email,
        },
      );

      return {
        message:
          'If an account exists with this email, a password reset link has been sent.',
      };
    } catch (error: unknown) {
      // Always return success to prevent email enumeration attacks
      this.logger.warn(
        `Forgot password attempt failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      return {
        message:
          'If an account exists with this email, a password reset link has been sent.',
      };
    }
  }

  // ─── Verify Token ────────────────────────────────────────────

  async verifyToken(token: string): Promise<FirebaseUser> {
    try {
      const decodedToken: DecodedIdToken =
        await this.firebaseService.auth.verifyIdToken(token, true);

      return this.buildFirebaseUser(decodedToken);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Token verification error: ${message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // ─── Revoke Token ─────────────────────────────────────────────

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

  // ─── Set Custom Claims ────────────────────────────────────────

  async setCustomClaims(
    uid: string,
    claims: Record<string, unknown>,
  ): Promise<void> {
    await this.firebaseService.auth.setCustomUserClaims(uid, claims);
    this.logger.log(`Custom claims set for user: ${uid}`);
  }
}
