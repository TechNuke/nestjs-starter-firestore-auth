import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (admin.apps.length > 0) {
      this.firebaseApp = admin.app();
      return;
    }

    const projectId = this.configService.get<string>('firebase.projectId');
    const clientEmail = this.configService.get<string>('firebase.clientEmail');
    const privateKey = this.configService.get<string>('firebase.privateKey');
    const databaseURL = this.configService.get<string>('firebase.databaseURL');
    const storageBucket = this.configService.get<string>(
      'firebase.storageBucket',
    );

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.error('Firebase credentials are missing!');
      throw new Error('Firebase credentials are not properly configured.');
    }

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL,
      storageBucket,
    });

    this.logger.log('✅ Firebase Admin SDK initialized successfully');
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
