import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FirebaseUser } from '../auth/interfaces/firebase-user.interface';
import { FirebaseService } from '../firebase/firebase.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly collection = 'users';

  constructor(private readonly firebaseService: FirebaseService) {}

  private get db() {
    return this.firebaseService.firestore;
  }

  async findOrCreate(firebaseUser: FirebaseUser): Promise<User> {
    const uid: string = firebaseUser.uid;
    const userRef = this.db.collection(this.collection).doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      await userRef.update({ updatedAt: new Date() });
      return {
        uid: userDoc.id,
        ...(userDoc.data() as Omit<User, 'uid'>),
      };
    }

    const newUser: Omit<User, 'uid'> = {
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      phoneNumber: firebaseUser.phoneNumber,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    await userRef.set(newUser);
    this.logger.log(`New user created: ${uid}`);

    return { uid, ...newUser };
  }

  async findById(uid: string): Promise<User> {
    const userDoc = await this.db.collection(this.collection).doc(uid).get();

    if (!userDoc.exists) {
      throw new NotFoundException(`User with uid ${uid} not found`);
    }

    return {
      uid: userDoc.id,
      ...(userDoc.data() as Omit<User, 'uid'>),
    };
  }

  async findAll(): Promise<User[]> {
    const snapshot = await this.db
      .collection(this.collection)
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...(doc.data() as Omit<User, 'uid'>),
    }));
  }

  async update(uid: string, dto: UpdateUserDto): Promise<User> {
    const userRef = this.db.collection(this.collection).doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new NotFoundException(`User with uid ${uid} not found`);
    }

    const updates: Partial<Omit<User, 'uid'>> = {
      ...dto,
      updatedAt: new Date(),
    };

    await userRef.update({ ...updates });
    const updated = await userRef.get();

    return {
      uid: updated.id,
      ...(updated.data() as Omit<User, 'uid'>),
    };
  }

  async deactivate(uid: string): Promise<void> {
    const userRef = this.db.collection(this.collection).doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new NotFoundException(`User with uid ${uid} not found`);
    }

    await userRef.update({ isActive: false, updatedAt: new Date() });
    this.logger.log(`User deactivated: ${uid}`);
  }
}
