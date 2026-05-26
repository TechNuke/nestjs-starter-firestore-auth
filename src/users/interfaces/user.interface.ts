import type { Timestamp } from 'firebase-admin/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  isActive: boolean;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
