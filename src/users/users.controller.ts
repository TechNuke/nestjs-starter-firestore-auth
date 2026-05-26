import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FirebaseUser } from '../auth/interfaces/firebase-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get or create current user profile in Firestore' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  getProfile(@CurrentUser() user: FirebaseUser) {
    return this.usersService.findOrCreate(user);
  }

  @Get(':uid')
  @ApiOperation({ summary: 'Get a specific user by UID' })
  @ApiParam({ name: 'uid', description: 'Firebase User UID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('uid') uid: string) {
    return this.usersService.findById(uid);
  }

  @Patch(':uid')
  @ApiOperation({ summary: 'Update a user by UID' })
  @ApiParam({ name: 'uid', description: 'Firebase User UID' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('uid') uid: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(uid, dto);
  }

  @Delete(':uid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate a user by UID' })
  @ApiParam({ name: 'uid', description: 'Firebase User UID' })
  @ApiResponse({ status: 204, description: 'User deactivated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  deactivate(@Param('uid') uid: string) {
    return this.usersService.deactivate(uid);
  }
}
