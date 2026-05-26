import { FirebaseUser } from './firebase-user.interface';

export interface LoginResponse {
  user: FirebaseUser;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface RefreshResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

// Firebase REST API response shapes
export interface FirebaseSignInResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  displayName?: string;
}

export interface FirebaseRefreshResponse {
  access_token: string;
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
}

export interface FirebaseErrorResponse {
  error: {
    code: number;
    message: string;
    errors: Array<{ message: string; domain: string; reason: string }>;
  };
}
