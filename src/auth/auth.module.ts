import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { FirebaseStrategy } from './strategies/firebase.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'firebase' })],
  controllers: [AuthController],
  providers: [AuthService, FirebaseStrategy, FirebaseAuthGuard],
  exports: [AuthService, FirebaseAuthGuard],
})
export class AuthModule {}
