export interface FirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  disabled: boolean;
  provider: string;
  customClaims: Record<string, unknown>;
}
