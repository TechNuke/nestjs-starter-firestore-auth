import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp!: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    if (admin.apps.length > 0) {
      this.firebaseApp = admin.app();
      return;
    }

    // Method A: JSON file path
    const serviceAccountPath = this.configService.get<string>(
      'firebase.serviceAccountPath',
    );

    if (serviceAccountPath) {
      const absolutePath = resolve(serviceAccountPath);

      if (!existsSync(absolutePath)) {
        throw new Error(
          `Firebase service account file not found: ${absolutePath}`,
        );
      }

      const rawContent = readFileSync(absolutePath, 'utf-8');
      const serviceAccount = JSON.parse(rawContent) as admin.ServiceAccount;

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      this.logger.log(
        '✅ Firebase Admin SDK initialized (service account file)',
      );
      return;
    }

    // Method B: Individual environment variables
    const projectId = this.configService.get<string>('firebase.projectId');
    const clientEmail = this.configService.get<string>('firebase.clientEmail');
    const privateKey = this.configService.get<string>('firebase.privateKey');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Firebase credentials missing! Provide either ' +
          'FIREBASE_SERVICE_ACCOUNT_PATH or ' +
          'FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY',
      );
    }

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    this.logger.log(
      '✅ Firebase Admin SDK initialized (environment variables)',
    );
  }

  get auth(): admin.auth.Auth {
    return this.firebaseApp.auth();
  }

  get firestore(): admin.firestore.Firestore {
    return this.firebaseApp.firestore();
  }

  get storage(): admin.storage.Storage {
    return this.firebaseApp.storage();
  }
}
