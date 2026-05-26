import type { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseUser } from '../interfaces/firebase-user.interface';

export class FirebaseUserMapper {
  static fromDecodedToken(decodedToken: DecodedIdToken): FirebaseUser {
    return {
      uid: decodedToken.uid,
      email: decodedToken.email ?? '',
      emailVerified: decodedToken.email_verified ?? false,
      displayName: (decodedToken.name as string) ?? '',
      photoURL: (decodedToken.picture as string) ?? '',
      phoneNumber: (decodedToken.phone_number as string) ?? '',
      disabled: false,
      provider: decodedToken.firebase.sign_in_provider,
      customClaims: decodedToken,
    };
  }
}
