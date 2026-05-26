import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { VerifyTokenDto } from './dto/verify-token.dto';
// Regular import — NOT "import type"
// because it's used in decorated parameter signatures
import { FirebaseUser } from './interfaces/firebase-user.interface';

interface VerifyResponse {
  valid: boolean;
  user: FirebaseUser;
}

interface LogoutResponse {
  message: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify a Firebase ID token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Token is invalid or expired' })
  async verifyToken(@Body() dto: VerifyTokenDto): Promise<VerifyResponse> {
    const user = await this.authService.verifyToken(dto.token);
    return {
      valid: true,
      user,
    };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@CurrentUser() user: FirebaseUser): FirebaseUser {
    return user;
  }

  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke all tokens for current user (logout)' })
  @ApiResponse({ status: 200, description: 'Tokens revoked successfully' })
  async logout(@CurrentUser() user: FirebaseUser): Promise<LogoutResponse> {
    await this.authService.revokeToken(user.uid);
    return { message: 'Logged out successfully' };
  }
}
